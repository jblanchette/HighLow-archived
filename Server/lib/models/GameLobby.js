var mongoose = require('mongoose');

var Schema = new mongoose.Schema({
    members: []
});

Schema.pre('save', function(next){

});

Schema.methods = {

};

var Model = mongoose.model('GameLobby', Schema);
module.exports = mongoose.model('GameLobby');