const Guild = require('../../models/Guilds')
const {getId} =require('../../utils/helpers')

const isNumeric = function(num){
    return !isNaN(num)
  }
  
module.exports = async function(message,args){
        try
        {
            const amount = args[2],
                  guild  = await Guild.findOne({ id : message.guild.id}),
                  who    = message.author.id
            if(!guild)  return
            
            const player = await getId(message,guild,args[1])
            if(!player) return
            
            //check if amount is a number
            if(!isNumeric(amount))
                return message.channel.send(`${amount} is not numeric`)

            //check whether bettor has enough currency to bet 
            let bettor = await Guild.findOne({'id' : message.guild.id , 'users.id' : who},{'users.$' : 1})
            bettor = bettor.users[0]
            console.log('bettor',bettor)
            if(bettor.currency >= amount)
                await Guild.updateOne({'id' : message.guild.id , 'users.id' : who},{
                    '$inc' : {
                        'users.$.currency' : -amount
                    }
                })
            else
                return message.channel.send(`<@${player}>, you don't have enough currency [${bettor.currency}]`)

            //search for a match where player is participating
            const match = await guild.cup.round.matches.find(match =>{
                return (match.first == player || match.second == player)
            })
            if(!match) return message.channel.send('No such match in this Round')
            
            if(match.isRunning)     return message.channel.send('Can\'t place bet, match is running now')

            //update bet details in db
            await Guild.updateOne({'name' : message.guild.name , 'cup.round.matches._id' : match._id },{'$push': {
                                                                            'cup.round.matches.$.betsOn' : {
                                                                                    'player' : player,
                                                                                    'who' : message.author.id,
                                                                                    'amt' : amount
                                                                                                        }
                                                                                        }
                                                                       })
            return message.channel.send(`<@${message.author.id}> bid  **\` ${amount} \`**  on <@${player}>`)
        }
        catch(error)
        {
            console.log(error)
        }
    }
