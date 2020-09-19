require('dotenv').config()

const {guildSearch,getId, matchEnd} = require('../utils/helpers')
module.exports = {
    name : 'forcewin',
    async execute(message,args) {
        try{
            const guild = await guildSearch(message)
            if(!guild)  return
            
            if(message.author.id == process.env.GUILD_OWNER_ID)
            return message.channel.send('only Guild Owner have access to this command')
        
            const player = await getId(message,guild,args[0])
            if(!player) return 

            const match = await guild.cup.round.matches.find(m =>{ return (m.first == player   || m.second == player) } )
            if(!match)
                return message.channel.send('No such match in this round..')
            

            await matchEnd(message,match,player)
            message.channel.send(`<@${player}> def <@${player == match.second ? match.first:match.second}>`)
        }
        catch(err) {
            console.log(err)
        }
    }
}