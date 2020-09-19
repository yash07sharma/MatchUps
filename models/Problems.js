const mongoose = require('mongoose')

var ProblemSchema = new mongoose.Schema({
    name        : String,
    constestID  : String,
    index       : String,
    points      : Number
})

module.exports = mongoose.model('Problem',ProblemSchema)