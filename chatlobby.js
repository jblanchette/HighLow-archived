
    var jChatLobby = function() {
        this.roomName = "Room #" + Math.floor((Math.random() * 10000) + 1);
        this.members = [];
    };

    jChatLobby.prototype.add = function(uID, name) {
        this.members[uID] = name;
    };

    jChatLobby.prototype.remove = function(uID) {
        delete this.members[uID];
    };

    jChatLobby.prototype.broadcast = function(uID) {

    };

    exports.ChatLobby = jChatLobby;