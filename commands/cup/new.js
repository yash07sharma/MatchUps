const Guild = require('../../models/Guilds')

module.exports = async function(message)
    {
        try
        {
            const guild = await Guild.findOne({ id : message.guild.id },(err,res)=>{
                if(err){
                    console.log('ERROR in launch : '+err)
                    return
                }
            })
            
            if(guild.isCupRunning)
                return message.channel.send('Cup is already running..')
            
            message.channel.send('@here Cup has been launched on '+message.channel.name)
            guild.isCupRunning = true  
            guild.cup.channel = message.channel.name
            await guild.save()  
        }
        catch(error) {
            console.log(error)
        } 
    }
