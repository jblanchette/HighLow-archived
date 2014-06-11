var _ = require("underscore");
ClientData = require("./server.client.data").ClientData;

var jClient = function( socketID, nickname ){
    this.socketID = socketID;
    this.nickname = nickname;
    this.roomList = {};
    this.permissions = 0;
    this.data = new ClientData();
};

var jp = jClient.prototype;


jp.setAdmin = function(){
    this.permissions = 1;
};

jp.addRoom = function( roomID, roomName ){
    if(!_.has(this.roomList,roomID)){
        this.roomList[roomID] = roomName;
    }
};

exports.Client = jClient;