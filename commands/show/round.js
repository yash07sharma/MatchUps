const Guild = require('../../models/Guilds')
const Discord = require('discord.js')
const { guildSearch } = require('../../utils/helpers')
module.exports = async function(message){
    try{
        const embed = new Discord.MessageEmbed()
                        .setColor('#ff9900')
                        .setTitle('Match')
                        .setURL('https://discord.js.org/')
                        
            const guild = await guildSearch(message)
            if(!guild) return
            
            if(!guild.isCupRunning)
                    return message.channel.send('No Cup running..')
            if(!guild.cup.round)
                    return message.channel.send(`No round running, start one with *~cup start*`)
            
            if(guild.cup.round.name=='FINALS' && guild.cup.round.matches[0].hasEnded == true)
            {
                return message.channel.send(`Cup has ended, <@${guild.lastCupWinner}> won.`)    
            }
            embed.setTitle(guild.cup.round.name)
            guild.cup.round.matches.forEach(match => {
                const player1 = guild.users.find(user => user.id == match.first)
                const player2 = guild.users.find(user => user.id == match.second)
                embed.addField(`> ***${player1.name.padEnd(20,' ')}***  \` VS \`  ***${player2.name.padStart(20,' ')}***`,'\u200b')
            })
            
            message.channel.send(embed)
    }
    catch(err){
        console.log(err)
    }
}