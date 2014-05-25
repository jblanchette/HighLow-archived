
    var jChatLobby = function( roomName, owner ) {

        if(arguments.length === 0){
            this.roomName = "Room #" + Math.floor((Math.random() * 10000) + 1);
            this.owner = -1;
        }else{
            this.roomName = roomName;
            this.owner = owner;
        }

        this.members = [];

    };

    jChatLobby.prototype.addMember = function(uID, name) {
        this.members[uID] = name;
    };

    jChatLobby.prototype.removeMember = function(uID) {
        delete this.members[uID];
    };

    jChatLobby.prototype.broadcast = function(uID) {

    };

    exports.ChatLobby = jChatLobby;