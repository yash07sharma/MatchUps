const mongoose = require('mongoose')
const Problem = require('./Problems')

const MatchSchema = new mongoose.Schema({
    first : String,
    second : String,
    isRunning : Boolean,
    hasEnded : Boolean,
    problems : [Problem.schema],
    betsOn : [{
        player: String,
        who : String,
        amt : Number
    }],
    scoreFirst : Number,
    scoreSecond : Number,
    winner : String
})

module.exports = mongoose.model('Match',MatchSchema)