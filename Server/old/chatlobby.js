var _ = require("underscore");

var jChatLobby = function(LobbyID, roomName, owner) {

    this.id = LobbyID;

    if (arguments.length === 1) {
        this.roomName = "Room #" + Math.floor((Math.random() * 10000) + 1);
        this.owner = -1;
    } else {
        this.roomName = roomName;
        this.owner = owner;
    }

    this.members = {};

};

var jc = jChatLobby.prototype;

jc.isFull = function(){
    return !(_.keys(this.members).length < 249);
};

jc.addMember = function( socketID, nickname ) {
    this.members[socketID] = nickname;
};

jc.removeMember = function(id) {
    if(_.keys(this.members).length === 1){
        this.members = {};
    }else{
        delete this.members[id];
    }
};

exports.ChatLobby = jChatLobby;