var _ = require("underscore"),
    ChatLobby = require("../chat/Lobby"),
    Util = require("../util/Util");

function ChatManager(){
    this.rooms = {};
}

ChatManager.prototype.create = function( roomOwner, roomOptions ){
    console.log("running chat create");
    if( !_.isObject( roomOptions ) ){
        roomOptions = {};
    }

    // roomOnwer value of -1 means server owned
    if( roomOwner === -1 || !_.has(roomOptions, "roomName") ){
        roomOptions.roomName = "Room-" + (_.size(this.rooms) + 1);
    }

    var roomID = this.generateID();

    // Create a new Chat Lobby with the given name

    this.rooms[roomID] = new ChatLobby( roomID, roomOwner, roomOptions);

    return this.rooms[roomID];
    
};

ChatManager.prototype.get = function(roomID){
    if(!_.has(this.rooms, roomID)){
        console.log("*** ERROR *** Tried to get room that doesn't exist: ", roomID);
        return null;
    }

    return this.rooms[roomID];
}

ChatManager.prototype.removeFromRoom = function ( roomID, client ){
    var Lobby = this.get(roomID);
    Lobby.remove(client);
};

ChatManager.prototype.addToRoom = function( roomID, client ){
    var Lobby = this.get(roomID);
    console.log("Adding client to Room: ", roomID, "client id:",client.id);
    Lobby.add(client);
};

ChatManager.prototype.generateID = function(){
  var result = "";
  var charCode;

  var done = false;

    while (!done) {
        for (var i = 0; i < 10; i++) {
            charCode = 48 + Math.floor(Math.random() * 9);
            result += String.fromCharCode(charCode);
        }
        if (!_.has(this.rooms, result)) {
            done = true;
        }
    }

  return result;
};

ChatManager.prototype.getVacantLobby = function(){

    var roomID = -1;
    var room;

    for(roomKey in this.rooms){

       room = this.rooms[roomKey];
       if(!room.isFull()){
           return room.id;
       }
    }

    console.log("no rooms!!!");
    return -1;
};

var jChatManager = (jChatManager || new ChatManager());
module.exports = jChatManager;