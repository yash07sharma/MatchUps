const { guildSearch } = require("../../utils/helpers")
const Cup = require("../../models/Cups"),
      Guild = require('../../models/Guilds'),
      Round = require('../../models/Rounds')
module.exports = 
    async function(message)
    {
        const guild = await guildSearch(message)
        
        //resolve bets
        let amountsBid = new Map()
        guild.users.forEach(user => amountsBid [user.id] = 0) 
        guild.cup.round.matches.forEach(async match => {
            if(!match.hasEnded) {
                await match.betsOn.forEach(bet => {
                    amountsBid[bet.who] += bet.amt   
                })
            }  
        })
        await guild.users.forEach(async user=> {
            await Guild.update({'id' : message.guild.id , 'users.id' : user.id},{
                '$inc' : {
                    'users.$.currency' : amountsBid[user.id]
                }
            })
        })

        //init new CUP
        await Guild.updateOne({'id' : message.guild.id},{
            '$set' : {
                'cup' : new Cup({
                            players     : [],
                            channel     : null,
                            round       : new Round({
                                                        name            : null,
                                                        matches         : [],
                                                        matchesEnded    : 0,
                                                        winners         : []
                                                    }),
                  }),
                'isCupRunning'  : false,
                'hasCupStarted' : false
            }
        })

        message.channel.send('Reset done')
    }
