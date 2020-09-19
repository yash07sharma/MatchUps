const Guild = require('../models/Guilds')
module.exports = { 
    name : 'bet',
    async execute(message,args)
    {
        const guild = await Guild.findOne({  id : message.guild.id},(err,res)=>{
            if(err) return console.log(err)
        })

        if(!guild)  return message.channel.send(`no server found, please run *~setup* command`)
        if(!guild.isCupRunning) return message.channel.send(`No Cup running..`)
        if(!guild.cup.round)
        return message.channel.send(`No round running, start one with *~cup start*`)

        switch(args[0])
        {
            case 'on' :
                const on_ = require('./bet/on')
                await on_(message,args)
                break
            
            default : 
            return message.channel.send('invalid command')
        }
    }
}