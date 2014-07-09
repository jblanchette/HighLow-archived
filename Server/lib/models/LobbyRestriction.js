var mongoose = require('mongoose');

var Schema = new mongoose.Schema({
   rule: []
});

var Model = mongoose.model('LobbyRestriction', Schema);
module.exports = mongoose.model('LobbyRestriction');