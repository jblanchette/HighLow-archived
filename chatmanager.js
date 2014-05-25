    var ChatLobby = require("chatlobby");


    var jChatManager = function() {
        this.rooms = [];
    };

    jChatLobby.prototype.createRoom = function( name, owner ){
        var Lobby = new ChatLobby(name, owner);
        this.rooms.push(Lobby);
    };

    jChatLobby.prototype.remove = function(uID) {
        delete this.members[uID];
    };

    jChatLobby.prototype.broadcast = function(uID) {

    };

    exports.ChatLobby = jChatLobby;