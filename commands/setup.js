const Guild = require('../models/Guilds')
const Cup = require('../models/Cups')
const Round = require('../models/Rounds')

module.exports = {
    name : 'setup',
    description : '',
    async execute(message)
    {
        try{
            var guild = await Guild.findOne({id : message.guild.id},function(err,found) {
                if(err)        return message.channel.send('ERROR : '+err)
            })

            if(!guild){
                console.log(`Adding server to DB`)
                guild = new Guild({
                                    name            : message.channel.guild,
                                    id              : message.channel.guild.id,
                                    users           : [],
                                    isCupRunning    : false,
                                    hasCupStarted   : false,
                                    lastCupWinner   : null,
                                    cup : new Cup({
                                                    players     : [],
                                                    channel     : null,
                                                    round       : new Round({
                                                                                name            : null,
                                                                                matches         : [],
                                                                                matchesEnded    : 0,
                                                                                winners         : []
                                                                            }),
                                                }), 
                                }) 
                await guild.save((err) => {
                    if(err) return message.channel.send('error while creating : '+err)
                    message.channel.send('successfully saved in db')    
                })
            }
            message.channel.send(`Setup done..`)
        }
        catch(err)
        {console.log('error : '+err)}
    }
}
