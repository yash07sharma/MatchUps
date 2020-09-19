const Discord = require('discord.js')
const Guild = require('../models/Guilds')
const {matchSearch,matchStart,matchEnd} = require('./helpers')
const readMatchStart = async function(message){
    const userids = message.content.match(/Starting match between <@(\d+)> and <@(\d+)>/)    
    console.log('MATCH B/W : ',userids)
    const match = await  matchSearch(message,userids[1],userids[2])
    if(!match)  return message.channel.send('No such match in this Round..')
    console.log('match details',match)
    await matchStart(message,match.id)
    message.channel.send(`started the match`)  
}

const readMatchEnd = async function(message){
    if(message.content.startsWith('Match over, its a draw between '))
    {
        const userids = message.content.match(/Match over, its a draw between <@(\d+)> and <@(\d+)>!/)
        console.log('RESULT MENTIONS : ',userids) 
        
        // const resultscores = message.content.match(/Final score (\d+) - (\d+)/)
        // console.log('RESULT SCORES : ',resultscores)
        
        const match = await matchSearch(message,userids[1],userids[2])
        if(!match)  return message.channel.send('No such match in this Round..')
        if(!match.isRunning)    return message.channel.send('Match not running..')
         
        // await matchEnd(message,match,0)
    }
    else 
    {
        const userids = message.content.match(/Match over, <@(\d+)> has defeated <@(\d+)>/)
        console.log('RESULT MENTIONS : ',userids)

        
    }
}
module.exports = {readMatchStart , readMatchEnd}