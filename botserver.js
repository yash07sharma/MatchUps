require('dotenv').config()

const fs        = require('fs')
    , Discord   = require('discord.js')
    , mongoose = require('mongoose')
    , prefix    = '~'
    , { readMatchStart } = require('./utils/lockout')

//link with commands
global.client = new Discord.Client()
client.commands = new Discord.Collection()
const commandFiles = fs.readdirSync('./commands')
for(const file of commandFiles){
    if(!file.endsWith('.js'))   continue
    const command = require(`./commands/${file}`)
    client.commands.set(command.name, command)
}

//client starts
client.once('ready',() =>   console.log('Ready!'))

//connect to db
mongoose.set('debug',true)
const  url = process.env.MONGODB_URL
mongoose.connect(url,{useNewUrlParser:true,useUnifiedTopology:true})
global.db = mongoose.connection
db.on('error',err=> console.log(`DB ERROR : ${err}`))
.once('open',()=>   console.log('connected to database'))

//read messages
client.on('message',async message => {
    console.log(message.content)
    console.log('user id',message.author.id)
    if(message.author.username=='LockoutBot')
    {
        /*
            NOT WORKING : read match end from  LockOut Bot 
        */

        // if(message.content.startsWith(`Match over,`))
        //     return readMatchEnd(message)
        // const embedread = JSON.stringify(message.embeds)
        //     console.log('MESSAGE  : ',message.content)

        if(message.content.startsWith('Starting match between'))
            readMatchStart(message)
        return 
    }
    else if(!message.content.startsWith(prefix))  
        return
    
    const raw_args = message.content.slice(prefix.length).trim().split(' ')
        , command = raw_args.shift().toLowerCase()
    
    // discard empty array elements of raw_args and push rest in args
    let args = []
    raw_args.forEach(arg => {
        if(arg.length )     args.push(arg)
    })
    console.log(`args : ${args}`)
    console.log(`command : ${command}`)
    
    if (!client.commands.has(command)) return

    try {
        console.log('args :  ',args)
        if(command == 'help' || command == 'setup')                    client.commands.get(command).execute(message)  
        else                                                           client.commands.get(command).execute(message,args)       
    }   
    catch (err) {
	    console.error(err)
	    message.reply('there was an error trying to execute that command!')
    }
})


//SECRET TOKEN
client.login(process.env.DISCORD_TOKEN)