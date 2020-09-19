const { newRound } = require('../../utils/helpers')
require('dotenv').config()

module.exports = async function(message){
    try
    {
        if(message.author.id != process.env.GUILD_OWNER)
            return message.channel.send('only Guild Owner has access to this command')
        await newRound(message)
    }
    catch(err){
        console.log(err)
    }
}