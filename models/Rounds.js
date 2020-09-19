const mongoose = require('mongoose')
const Match = require('./Matches')

var RoundSchema  = new mongoose.Schema({
    name: String,
    matches: [Match.schema],
    matchesEnded : Number,
    winners : [String]
})

module.exports = mongoose.model('Round',RoundSchema)