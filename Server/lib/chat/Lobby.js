var _ = require("underscore"),
    SocketManager = require("../managers/SocketManager");

function Lobby( roomID, roomOwner, roomOptions ){
    this.id = roomID;
    this.owner = roomOwner;
    this.options = roomOptions;

    this.members = {};
}

Lobby.prototype.add = function( client ){
    if(!_.has(this.members, client.id)){
        this.members[client.id] = client.getSocket().id;
        console.log("Added to room ", this.options, client.id);
    }
};

Lobby.prototype.isFull = function(){
    return !(_.size(this.members) <= 250);
};

module.exports = Lobby;