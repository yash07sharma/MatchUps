const shuffle = require('./shuffle')
const Match = require('../models/Matches')
const Guild = require('../models/Guilds')
const Discord = require('discord.js')
const byes = (num)=>{
        return  (Math.pow(2,Math.ceil(Math.log2(num))) - num)
    }

const knockout = (num)=>{
        return byes(num)==0
    }

const roundName = (num)=>{
        if(num==2)
            return 'FINALS'
        else if(num==4)
            return 'Semi-Finals'
        else if(num==8)
            return 'Quarter-Finals'
        else if(knockout(num))
            return `${num}-Finals`
        else   
            return 'Qualifiers'
    }

const generate = async (message,players)=>{
        var num1 = players.length
        fixtures = []
        const playersInMatch = shuffle(players.slice(byes(num1),num1))
        num2 = playersInMatch.length
        for(i=0;i<num2;i+=2)           
                fixtures.push(new Match({
                                           first : playersInMatch[i],
                                           second : playersInMatch[i+1],
                                           isRunning : false,
                                           hasEnded  : false,
                                           problems : [],
                                           betsOn : [],
                                           scoreFirst : 0,
                                           scoreSecond : 0,
                                           winner : null 
                }))
        //if this round is qualifiers , have to include players who were given byes in winners of this round
        const playersWithByes = players.slice(0,byes(num1))
        console.log('playerWithByes',playersWithByes)
        await Guild.updateOne({'id' : message.guild.id},{
            '$push' : {
                'cup.round.winners' : playersWithByes
            }})
        return fixtures
    }

const sortPlayers = async function(guild,players) {
        let user1,user2
        return await players.sort(async (first,second)=>{
                user1 = await guild.users.find(user => user.id==first)
                user2 = await guild.users.find(user => user.id==second)
                if(first == guild.lastCupWinner)    return  1
                else if(second==guild.lastCupWinner)return -1
                else if(user2.matches_won/user2.matches_played > user1.matches_won/user1.matches_played)    return -1
                else if(user2.matches_won/user2.matches_played < user1.matches_won/user1.matches_played)    return 1                               
                else                                return 0 
        })
        
}


const guildSearch = async function(message){
    const guild = await Guild.findOne({  'id' : message.guild.id})
    if(!guild)    message.channel.send(`no server found, please run *~setup* command`)
    return guild
}

const matchSearch = async function(message,first,second) {
    const guild = await guildSearch(message)
    if(!guild)  return
    return  await guild.cup.round.matches.find(m =>{
        return (m.first == first  && m.second == second) ||
               (m.first == second && m.second == first)
    })
}

const matchStart = async function(message,matchID) {
    await Guild.updateOne({'id' : message.guild.id , 'cup.round.matches._id' : matchID},{'$set' : {
        'cup.round.matches.$.isRunning' : true   
    } })
}

const matchEnd = async function(message,match,winner) {
    try{
        const loser = match.first==winner ? match.second : match.first
        await Guild.updateOne({'id' : message.guild.id , 'cup.round.matches._id' : match.id}, {
            '$set' : {
            'cup.round.matches.$.isRunning' : false ,
            'cup.round.matches.$.hasEnded'  : true
        } ,
            '$inc' : {
            'cup.round.matchesEnded' : 1
        } ,
            '$push' : {
            'cup.round.winners' : winner    
        }
     })

        await Guild.updateOne({'id' : message.guild.id , 'users.id' : winner},{
            '$inc' : {
                'users.$.matches_won' : 1,
                'users.$.matches_played' : 1
            }})
        
        await Guild.updateOne({'id' : message.guild.id , 'users.id' : loser},{
            '$inc' : {
                'users.$.matches_played' : 1
            }
        })

        const guild = await guildSearch(message)
 
        //calculating money gain and lost on the match
        let moneyonwinner = 0, moneyonloser = 0, left , usergain
        let gains = new Map()
 
        guild.users.forEach(user => gains[user.id] = 0)
 
        //moneyonloser  : total amount bid on loser
        //moneyonwinner : totla amount bid on winner
        match.betsOn.forEach(bet => {
            if(bet.on == winner)
                gains[bet.who] = bet.amt , moneyonwinner += bet.amt
            else                 
                moneyonloser += bet.amt      
        })
        
        //left  : amount of moneyonloser that goes to the match winner
        left = moneyonloser
        match.betsOn.forEach(bet => {
            if(bet.on == winner) {
                usergain = moneyonloser * 80/100 * (gains[bet.who] / moneyonwinner)
                left -= usergain
                gains[bet.who] += usergain
            }
        })
        
        gains[winner] += left
        console.log('gains',gains)
        await guild.users.forEach(async user => {
            await Guild.updateOne({'id' : message.guild.id , 'users.id' : user.id},{'$inc' : {
                'users.$.currency' : gains[user.id]
            }})
        })
    
        const updatedGuild = await guildSearch(message) 
        const updatedRound = updatedGuild.cup.round
        //check if round is complete
        if(updatedRound.matchesEnded == updatedRound.matches.length)
            newRound(message)
    }
    catch(err){
        console.log(err)
    }
}

const getId = async function(message,guild,str) {    //gets id [Discord] from user name
    if(str.startsWith('<@') && str.endsWith('>') ) 
    {
        console.log(str)
        const regex = str.startsWith('<@!') ? str.match(/<@!(\d+)>/) :  str.match(/<@(\d+)>/)
        
        console.log('regex',regex)
        return regex[1]
    }     
    else
    {
        const user = await guild.users.find(user => user.name == str)
        if(!user) return message.channel.send('Invalid user')
        return user.id
    }
}

const newRound = async function(message)
{
    try{
        const guild = await guildSearch(message),
              embed = new Discord.MessageEmbed()
                .setColor('#ff9900')
                .setTitle('Result')

        if(guild.cup.round.name && guild.cup.round.matches.length != guild.cup.round.matchesEnded) 
            return message.channel.send(`${guild.cup.round.name} are going on`)

        if(guild.cup.round.winners.length==1 && guild.cup.round.name == 'FINALS') // no more rounds,have the winner
        {
            const player = guild.users.find(user => user.id==guild.cup.round.winners[0]).name
            embed.setDescription(`> ***Cup Champ***  ==>  ** \` ${player} \` **`)
            embed.setImage('https://img.freepik.com/free-vector/gold-trophy-icon-golden-goblet-with-star-reward-icon-white-isolated_138676-497.jpg?size=338&ext=jpg')
            await Guild.updateOne({'id' : message.guild.id , 'users.id' : guild.cup.round.winners[0]},{
                '$set' : {
                    'lastCupWinner' : guild.cup.round.winners[0],
                },
                '$inc' : {
                    'users.$.cups_won' : 1
                }
            })
            return message.channel.send(embed)
        }
        else if( guild.cup.players.length == 1) 
            return message.channel.send('Not enough players to start a Cup')
        else if(guild.cup.round.winners.length > 0)
        {   
            guild.cup.round.name = roundName(guild.cup.round.winners.length)     
            embed.setTitle(guild.cup.round.name)
            
            guild.cup.round.matches = await generate(message,guild.cup.round.winners)
            
            //addding matches to embed
            let player1,player2
            guild.cup.round.matches.forEach(match => {
                player1 = guild.users.find(user => user.id==match.first).name
                player2 = guild.users.find(user => user.id==match.second).name
                embed.addField(`> ***${player1}***  \` VS \`  ***${player2}***`,'\u200b')
            })
        }
        else
        {
            guild.cup.round.name = roundName(guild.cup.players.length)
            embed.setTitle(roundName(guild.cup.players.length))
            
            //sort players acc to winRatio [except the lastCupWinner]
            guild.cup.players = await sortPlayers(guild,guild.cup.players)
            console.log(guild.cup.players)
            //generate matches and byes
            guild.cup.round.matches = await generate(message,guild.cup.players)
            
            //add matches to embed
            guild.cup.round.matches.forEach(match => {
                const player1 = guild.users.find(user => user.id==match.first).name
                const player2 = guild.users.find(user => user.id==match.second).name
                
                embed.addField(`> ***${player1}***  \` VS \`  ***${player2}***`)
            })
                
        }
        message.channel.send(embed)
        guild.hasCupStarted = true
        guild.cup.round.matchesEnded = 0
        guild.cup.round.winners = []
        await guild.save()
        
    }
    catch(err){
        console.log(err)
    }
    
}
module.exports = { byes, knockout, roundName, generate, guildSearch, matchSearch, matchStart,matchEnd, getId,newRound}