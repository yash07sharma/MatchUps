const Guild  =require('../models/Guilds')
const User = require('../models/Users')
const CF = require('../utils/cf-client')

module.exports = {
    name : 'handle',
    async execute(message,args)
    {
        console.log('args : '+args)
        try{
            const guild = await Guild.findOne({ id : message.guild.id },(err,res)=>{
                if(err) console.log('ERROR in identify : '+err)
            } )

            if(!guild)                          return message.channel.send(`no server found, please run *~setup* command`)
            
            if(args.length==1)
            {
                const player        = message.author.username ,
                      handle        = args[0] ,
                      cfUser        = new CF(handle)
                await cfUser.info()
                
                if(cfUser.HTTPSstatus==400)
                    return message.channel.send(`No handle ${cfUser.handle}`)
                else if(cfUser.HTTPSstatus!=200)
                    return message.channel.send('CF not responding : '+cfUser.HTTPSstatus)
                console.log('MESSAGE AUTHOR',message.author)    
                console.log('MESSAGE AUTHOR ID',message.author.id)
                const user = new User({
                                            name            : player,
                                            handle          : handle,
                                            id              : message.author.id,
                                            maxRatingCF     : cfUser.maxRating,
                                            ratingCF        : cfUser.rating,
                                            cups_won        : 0,
                                            matches_won     : 0,
                                            matches_played  : 0,
                                            currency        : 500
                                        }) ,

                      guildUser = await guild.users.find(obj => {   return obj.name==player })
                
                if(guildUser)           console.log('Guild User : '+guildUser)
                if(guildUser)           return message.channel.send(`${guildUser.name} has handle -> ${guildUser.handle}`)
                else    
                {
                    guild.users.push(user)
                    guild.markModified('users')
                }

                await guild.save()
                message.channel.send(`${player} identified with handle ${handle}`)
            } 
        }
        catch(error)
        {
            console.log(error)
        }
    }
}