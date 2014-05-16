var jChatLobby = function() {
    this.roomName = "Room #" + Math.floor((Math.random() * 10000) + 1);
    this.members = [];
};

jChatLobby.prototype.add = function ( uID ){
    this.members.push( uID );
};

jChatLobby.prototype.remove = function ( uID ){

};

jChatLobby.prototype.broadcast = function ( uID ){

};

exports.ChatLobby = jChatLobby;