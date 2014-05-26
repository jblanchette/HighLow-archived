var ChatLobby = require("./chatlobby").ChatLobby,
    _ = require("underscore");

var jChatManager = function() {
    this.Server;
    this.rooms = [];
};

var jp = jChatManager.prototype;

jp.setup = function ( server ){
    this.Server = server;
};

jp.handleMessage = function(socket, msg) {
    switch (msg.type) {
            case "JOIN":
                if (msg.roomName === "ANY") {
                    console.log("running ChatManager.joinDefault");
                    this.joinDefault(socket, msg.nickname);
                }
                break;
            case "UPDATE":
                    this.update( msg );
                break;
    }
};

/**
 *  Pass the socketID from socket.io for hash access to them in the room
 */
jp.userDisconnect = function( socketID, _io ){
    var LM = this.Server.get("LoginManager");
    console.log("Disc test", LM);
    console.log("Nick: ", LM.getNickname(socketID));
};


jp.update = function(updateObj) {

        console.log("Chat Update: ", updateObj);

        if(_.has(updateObj, "roomName")){
            console.log("Sending update to room: " + updateObj.roomName);
            this.sendTo(updateObj.roomName, updateObj);
        }

    };

jp.createRoom = function(name, owner) {
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

jp.joinDefault = function( socket, name ){

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
        NewMember: name
    };
    this.sendTo(Lobby.roomName, ChatObj);

    socket.emit("CHAT",ClientObj);
    socket.join(Lobby.roomName);


};

jp.remove = function(uID) {
    delete this.members[uID];
};

jp.sendTo = function( room, msg ) {
    console.log("Sending Chat emit to " + room);
    console.log(msg);
    this.Server.get("IO").sockets.to( room ).emit("CHAT", msg);
};

exports.ChatManager = new jChatManager();