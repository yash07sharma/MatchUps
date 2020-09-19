const mongoose = require('mongoose')
const Round = require('./Rounds')
var CupSchema  = new mongoose.Schema({
    index       : Number,
    channel     : String,
    round       : Round.schema,
    players     : [String]
})

module.exports = mongoose.model('Cup',CupSchema)