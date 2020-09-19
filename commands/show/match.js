const Discord = require('discord.js')
const { matchSearch, getId, guildSearch } = require('../../utils/helpers')

module.exports = async function(message,args){
    try{
        //checking for command validity
        if(args[2] != 'vs' && args[2] != 'VS')
            return message.channel.send(`invalid command`)
        
        const embed1 = new Discord.MessageEmbed()
                    .setColor('#00ff99')
                    // .setTitle('\u200b')
                     , 
                embed2 = new Discord.MessageEmbed()
                    .setColor('#00ff99')
                    // .setTitle('\u200b')

        const guild = await guildSearch(message)
        
        if(!guild.isCupRunning)
                return message.channel.send('No Cup running..')
        if(!guild.cup.round)
                return message.channel.send(`No round running, start one with *~cup start*`)
                
        if(args.length==4)
        {
            const first  = await getId(message,guild,args[1])
            const second = await getId(message,guild,args[3])
            if(!first || !second)
                return message.channel.send('invalid users')
           
            const match = await matchSearch(message,first,second)
            if(!match)
                return message.channel.send('No such Match in this Round')
            
            //fetching avatars and usernames of players
            const avatar1 = await client.users.cache.get(`${first}`).avatar
            const avatar2 = await client.users.cache.get(`${second}`).avatar
            const user1 = await guild.users.find(user => user.id == first)
            const user2 = await guild.users.find(user => user.id == second)  
            
            embed1.setAuthor(`${user1.name}`,`https://cdn.discordapp.com/avatars/${first}/${avatar1}.webp`) 
            embed2.setAuthor(`${user2.name.padStart(20)}`,`https://cdn.discordapp.com/avatars/${second}/${avatar2}.webp`) 
            
            embed1.addField(` Played `,` ${String(user1.matches_played)}`,true)
            embed1.addField(`| Won `,`| ${String(user1.matches_won)}`,true)
            embed1.addField(`| Cups Won `,`| ${String(user1.cups_won)}`,true)
            embed1.addField(`\u200b`,`- - - - - - - - - - - - - - - - - - - - - - `)
            embed1.addField(` CF   `,` ${String(user1.ratingCF)}`,true)
            embed1.addField(`| CF Max `,`| ${String(user1.maxRatingCF)}`,true)
            embed1.addField(`| Currency`,`| ${String(user1.currency)}`,true)
            embed1.setFooter(`handle :  ${user1.handle} `)
            
            embed2.addField(` Played `,` ${String(user2.matches_played)}`,true)
            embed2.addField(`| Won `,`| ${String(user2.matches_won)}`,true)
            embed2.addField(`| Cups Won `,`| ${String(user2.cups_won)}`,true)
            embed2.addField(`\u200b`,`- - - - - - - - - - - - - - - - - - - - - - `)
            embed2.addField(` CF   `,` ${String(user2.ratingCF)}`,true)
            embed2.addField(`| CF Max `,`| ${String(user2.maxRatingCF)}`,true)
            embed2.addField(`| Currency`,`| ${String(user2.currency)}`,true)
            embed2.setFooter(`handle :  ${user2.handle} `)
            
            message.channel.send(embed1)
            message.channel.send(embed2)
        }
        else
            return message.channel.send('invalid information')
    }
    catch(err){
        console.log(err)
    }    
}
