const Guild = require("../../models/Guilds")
const Discord = require('discord.js')
const { guildSearch } = require("../../utils/helpers")
padAtEnd = function(str)
{
    let res = str
    while(res.length != 20)
        res +=  ' '
    return res
}

module.exports = async function(message){
    console.log('entered show users function')
    try{
        const embed = new Discord.MessageEmbed()
                    .setColor('#00ff99')
                    .setTitle('Users')

        const guild = await guildSearch(message)

        if(guild.users.length==0)
            return message.channel.send('No users identified yet')
        guild.users.forEach(user => {
            embed.addField(`     ${String(user.name).padEnd(20)} `,`> \`* Matches Played \` : ${String(user.matches_played).padEnd(10,' ')}  \n> \`* Matches Won    \` : ${String(user.matches_won).padEnd(10,' ')} \n> \`* Cups Won       \` : ${String(user.cups_won).padEnd(10,' ')} \n> \`* Currency       \` : ${user.currency}\n `)
            embed.addField('\u200b','\u200b')
        })
        message.channel.send(embed)
    }
    catch(err){
        console.log(err)
    }
}