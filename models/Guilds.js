const mongoose = require('mongoose')
const User = require('./Users')
const Cup = require('./Cups')

var GuildSchema = new mongoose.Schema({
    name            : String,
    id              : String,
    users           : [User.schema],
    isCupRunning    : Boolean,
    hasCupStarted   : Boolean,
    lastCupWinner   : String,
    cup             : Cup.schema
})

GuildSchema.statics.findByName = function(name){
    return this.find({name : name})
}

module.exports = mongoose.model('Guild',GuildSchema)
