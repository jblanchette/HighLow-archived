var _ = require("underscore");
ClientData = require("./server.client.data").ClientData;

var jClient = function( socketID, nickname ){
    console.log("Init Client");
    this.socketID = socketID;
    this.nickname = nickname;
    this.roomList = {};
    this.data = new ClientData();
};

var jp = jClient.prototype;

jp.addRoom = function( roomID, roomName ){
    if(!_.has(this.roomList,roomID)){
        this.roomList[roomID] = roomName;
    }
};

exports.Client = jClient;