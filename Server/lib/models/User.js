var mongoose = require('mongoose');

var Schema = new mongoose.Schema({
    nickname : String,
    permissions : String,
    rank : Number
});

var Model = mongoose.model('User', Schema);
module.exports = mongoose.model('User');