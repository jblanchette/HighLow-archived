var ChatLobby = require("./chatlobby").ChatLobby,
    _ = require("underscore");

var jChatManager = function() {
    this.Server;
    this.rooms = {};
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
                    this.joinDefault(socket);
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
jp.userDisconnect = function( nClient ){
    var _this = this;
    var DiscObj;

    console.log("Client was in rooms: ", nClient.roomList);

    _.each( nClient.roomList, function(roomName, roomID){
        DiscObj = {
            type: "UPDATE",
            roomID: roomID,
            RemoveMember: nClient.nickname
        };
        console.log("Telling Room " + roomID + " That he disc");
        _this.removeUserFromRoom( roomID );
        _this.sendTo( roomID, JSON.stringify(DiscObj) );

    });

};

jp.removeUserFromRoom = function( id ){
    var room = this.rooms[id];
    if(room !== undefined){
        console.log("Remove " + id + " From " + room.roomName);
        room.removeMember( id );
    }
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
    var LobbyID = this.generateRoomID();

    if (arguments.length === 0) {
        // Allocating a new global server chat room
        Lobby = new ChatLobby(LobbyID);
    } else {
        // Creating a custom owner chat room
        Lobby = new ChatLobby(LobbyID, name, owner);
    }

    this.rooms[Lobby.id] = Lobby;

    return Lobby;
};

/**
 * Generates a unique ID used to represent each room to allow the roomName
 * to change freely.  Also used as the hash index for fast room check / removal.
 *
 * @returns {String} Unique Room ID
 */
jp.generateRoomID = function(){
    var n = Math.floor((Math.random() * 100000) + 1);
    while( _.has(this.rooms, n)){
        n = Math.floor((Math.random() * 100000) + 1);
    }
    console.log("Gen ID:", n);
    return n;
};

jp.joinDefault = function( socket ){

    var LM = this.Server.get("LoginManager");
    var uClient = LM.get( socket.id );
    var roomTest;
    var Lobby;

    // See if there is an available default room, if not create one.
    var roomTest = _.find(this.rooms, function( room ){
        console.log("**  TEST: ", room);
        if( room.owner === -1 && !room.isFull() ){
            console.log("*** FOUND VALID ROOM");

            Lobby = room;
            Lobby.addMember( uClient.socketID, uClient.nickname );
            return true;
        }
    });

    // _.find returns undefined if no match is found.

    if(roomTest === undefined){
        // User can't fit in any existing global rooms, make a new one
        console.log("*** MADE NEW CHAT ROOM ****");
        Lobby = this.createRoom();
        Lobby.addMember( uClient.socketID, uClient.nickname );
    }

    uClient.addRoom( Lobby.id, Lobby.roomName );

    var RoomObj = {
        id: Lobby.id,
        roomName: Lobby.roomName,
        members: _.values(Lobby.members)
    };

    var ClientObj = {
        type: "JOIN",
        room: JSON.stringify(RoomObj)
    };

    var ChatObj = {
        type: "UPDATE",
        roomID: Lobby.id,
        NewMember: uClient.nickname
    };

    this.sendTo(Lobby.id, ChatObj);

    socket.emit("CHAT",ClientObj);
    socket.join(Lobby.roomName);


};

jp.sendTo = function( roomID , msg ) {
    console.log("Sending Chat emit to " + roomID);
    console.log(msg);
    this.Server.get("IO").sockets.to( roomID ).emit("CHAT", msg);
};

exports.ChatManager = new jChatManager();