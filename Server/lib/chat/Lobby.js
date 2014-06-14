var _ = require("underscore"),
    SocketManager = require("../managers/SocketManager"),
    MessageSender = require("../controllers/message/Sender");

function Lobby( roomID, roomOwner, roomOptions ){
    this.id = roomID;
    this.socketRoom = "ChatLobby-" + this.id;
    this.owner = roomOwner;
    this.options = roomOptions;

    this.members = {};
}

Lobby.prototype.addMessage = function ( msgObj ){
    var NewMsgObj = {
        action: "NewMsg",
        timestamp: msgObj.timestamp,
        authorID: msgObj.authorID,
        message: msgObj.message
    };

    MessageSender.emit(this.socketRoom, "CHAT", NewMsgObj);
};

Lobby.prototype.remove = function ( client ){
    var clientSocket = client.getSocket();
    delete this.members[client.id];

    clientSocket.leave(this.socketRoom);

    var LeaveObj = {
        action: "RemoveMember",
        roomID: this.id,
        clientID: client.id
    }

    MessageSender.emit(this.socketRoom, "CHAT", LeaveObj);
};

Lobby.prototype.add = function( client ){
    if(!_.has(this.members, client.id)){

        var clientSocket = client.getSocket();
        this.members[client.id] = clientSocket.id;

        var JoinObj = {
            action: "NewMember",
            roomID: this.id,
            client: {
                id: client.id,
                nickname: client.nickname
            }
        };

        MessageSender.emit(this.socketRoom,"CHAT", JoinObj);
        clientSocket.join(this.socketRoom);

        console.log("Added to room ", this.options, client.id);
    }
};

Lobby.prototype.isFull = function(){
    return !(_.size(this.members) <= 250);
};

module.exports = Lobby;