var ChatLobby = require("./chatlobby").ChatLobby;

var jChatManager = function() {
    this.io = null;
    this.rooms = [];
};

jChatManager.prototype.setup = function ( io  ){
    this.io = io;
};

jChatManager.prototype.handleMessage = function(socket, msg) {
    switch (msg.type) {
            case "JOIN":
                if (msg.roomName === "ANY") {
                    console.log("running ChatManager.joinDefault");
                    this.joinDefault(socket, socket.id);
                }
                break;
    }
};

jChatManager.prototype.createRoom = function(name, owner) {
    var Lobby;

    if (arguments.length === 0) {
        // Allocating a new global server chat room
        Lobby = new ChatLobby();
    } else {
        // Creating a custom owner chat room
        Lobby = new ChatLobby(name, owner);
    }
    this.rooms.push(Lobby);
};

jChatManager.prototype.joinDefault = function( socket, name ){

    var foundRoom = false;
    var Lobby;

    for(room in this.rooms){
        if(this.rooms[room].owner === -1 && !this.rooms[room].isFull()){
            Lobby = this.rooms[room];
            Lobby.addMember(name);
            foundRoom = true;
            break;
        }
    }

    if(!foundRoom){
        // User can't fit in any existing global rooms, make a new one
        Lobby = new ChatLobby();
        Lobby.addMember(name);
        this.rooms.push(Lobby);
    }

    var ClientObj = {
        type: "JOIN",
        room: JSON.stringify(Lobby)
    };

    var ChatObj = {
        type: "UPDATE",
        NewMember: socket.id
    };
    this.sendTo(Lobby.roomName, ChatObj);
    
    socket.emit("CHAT",ClientObj);
    socket.join(Lobby.roomName);


};

jChatManager.prototype.remove = function(uID) {
    delete this.members[uID];
};

jChatManager.prototype.sendTo = function( room, msg ) {
    console.log("Sending Chat emit to " + room);
    console.log(msg);
    this.io.sockets.to( room ).emit("CHAT", msg);
};

exports.ChatManager = new jChatManager();