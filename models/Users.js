const mongoose = require('mongoose')

var UserSchema = new mongoose.Schema({
    name            : String,
    handle          : String,
    id       : String,
    maxRatingCF     : Number,
    ratingCF        : Number,
    cups_won        : Number,
    matches_won     : Number,
    matches_played  : Number,
    currency        : {type : Number, default : 200}
})

module.exports  = mongoose.model('User',UserSchema)