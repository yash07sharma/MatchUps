const { guildSearch } = require('../utils/helpers')
module.exports = {
    name: 'show',
    description: '',
    async execute(message,args)
    {
        console.log('ENTERED SHOW function')
        try{
            const guild = await guildSearch(message)
            if(!guild)
                return message.channel.send(`no server found, please run *~setup* command`)
                
            switch(args[0])
            {
                case 'users' : 
                    const users = require('./show/users')
                    await users(message)
                    break

                case 'match' :
                    const match = require('./show/match')
                    await match(message,args)
                    break

                case 'round' :
                    const round = require('./show/round')
                    await round(message)
                    break
                default :   
                    return message.channel.send('invalid command')
            }
        }
        catch(err){
            console.log(err)
        }
    }
}