const Discord = require('discord.js')
const embed = new Discord.MessageEmbed()
                .setColor('#0099ff')
                .setTitle('HELP')
                .setURL('https://discord.js.org/')
                .setDescription('\n')
        embed.addField(`**~setup**`,`> setup the server in thr database`)
        embed.addField('**~handle <*cf handle*>**','> link your codeforces handle')
        embed.addField(`**~cup [commands below]**`,`**\` new     \`** :  launch a new cup\n`+
                                       `**\` start   \`** :  start the cup\n`+
                                       `**\` add me  \`** :  add urself to the cups\n`+
                                       `**\` players \`** :  users playing in the cup\n`, false)
        embed.addField(`**~show**`,    `**\` users   \`** :  match information of all users\n`+
                                       `**\` round   \`** :  running round\n`+
                                       `**\` match <PLAYER1> vs <PLAYER2> \`** :  match details\n`, false)

        embed.addField(`**~bet**`,`**\` on <PLAYER> <AMOUNT>\`** :  place bet on a player\n`)
        embed.addField(`**~forcewin <PLAYER>**`,`> *[Core access]* :  set result of a match`)
module.exports = {
    name: 'help',
    description: '',
    execute(message){
        console.log('author id in HELP',message.author.id)
            message.channel.send(embed)
    }
}