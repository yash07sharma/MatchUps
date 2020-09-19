const Guild = require("../../models/Guilds")
const { guildSearch } = require("../../utils/helpers")

module.exports = async function(message,args){
        try
        {
            const guild = await guildSearch(message)
            if(!guild)  return

            if(guild.hasCupStarted)
                return message.channel.send('can\'t add now, Cup has started')
            if(args.length==2 && args[1] == 'me')
            {
                const player = message.author.id
                console.log(player)
                const user = await guild.users.find(obj=>{
                    return obj.id == player
                })
                if(!user)
                    return message.channel.send('Need to add cf handle yourself first with : ~handle <CF HANDLE>')
                
                console.log('user id : '+player)
                
                if(guild.cup.players.includes(player))
                    return message.reply('already in Cup')
             
                await Guild.updateOne({'name' : message.guild.name},{'$push': {
                    'cup.players' : player    
                    }
               })
                message.channel.send(`Added <@${player}> to Cup`)
            }   
            else 
                message.reply('invalid command')   
            
            await guild.save()  
        }
        catch(error) {
            console.log(error)
        } 
}
