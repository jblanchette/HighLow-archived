var _ = require("underscore");

var jClient = function(){
    this.socketID = null;
    this.nickname = "";
    this.roomList = {};
    this.data = null;
};