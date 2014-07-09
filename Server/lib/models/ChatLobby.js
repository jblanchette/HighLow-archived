var mongoose = require('mongoose');

var RestrictionSchema = require('./LobbyRestriction').Schema;
var Schema = new mongoose.Schema({
    owner: String,
    members: [],
    options: {
        name: String,
        restrictions: [RestrictionSchema]
    }
});

Schema.pre('save', function(next){

});

Schema.methods = {

};

var Model = mongoose.model('ChatLobby', Schema);
module.exports = mongoose.model('ChatLobby');