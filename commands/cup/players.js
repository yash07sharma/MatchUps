const Discord = require('discord.js')
const Guild = require('../../models/Guilds') 

module.exports = async function(message){
        const  embed = new Discord.MessageEmbed()
                    .setColor("#734F96")
                    .setTitle('Players in Cup')

        players = ''
        const guild = await Guild.findOne({id : message.guild.id},(err,res)=>{
            if(err){
                return console.log('error : ',err)
            }
        })
        if(!guild.isCupRunning)
            return message.channel.send('No Cup running...')
        
        if(guild.isCupRunnning && guild.cup.channel != message.channel.name)
            return message.channel.send('Cup is running on channel : '+guild.cup.channelId)
        
        guild.cup.players.forEach(player => {
            const user = guild.users.find(user => user.id == player)
            players += `> ${user.name}\n`
        })
        embed.setDescription(players)
        message.channel.send(embed)
    }
