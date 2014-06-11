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