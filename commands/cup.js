const { guildSearch } = require('../utils/helpers')
module.exports = {
    name : 'cup',
    async execute(message,args)
    {
        try
        {
            console.log('ENTERED CUP COMMAND')
            const guild = await guildSearch(message)
            if(!guild)
                return message.channel.send(`no server found, please run *~setup* command`)
            if(!guild.isCupRunning && args[0]!='new')
                return message.channel.send('No Cup running..')
            
            if(guild.isCupRunning && guild.cup.channel != message.channel.name)
                return message.channel.send('Cup running on channel '+guild.cup.channel)
            switch(args[0])
            {
                case 'new' :
                    const new_ = require('./cup/new')
                    await new_(message)
                    break
                
                case 'add'  :
                    const add = require('./cup/add')
                    await add(message,args)
                    break

                case 'reset'   :
                    const reset = require('./cup/reset')
                    await reset(message)
                    break
                
                case 'players'   :
                    const show = require('./cup/players')
                    await show(message)
                    break

                case 'start'  :
                    const start = require('./cup/start')
                    await start(message)
                    break
                default :
                    return message.channel.send('invalid command')
            }
            await guild.save()  
        }
        catch(error) {
            console.log(error)
        } 
    }
}