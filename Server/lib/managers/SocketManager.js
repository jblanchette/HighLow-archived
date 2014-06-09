
var SocketInstance = require("../socket/Socket");

function SocketManager(){
    this.sockets = {};
};

SocketManager.prototype.add = function(ioSocket) {

    var socket = new SocketInstance(ioSocket);
    this.sockets[socket.id] = socket;

    return socket;
};

SocketManager.prototype.get = function ( socketID ){
    return this.sockets[socketID];
};

SocketManager.prototype.authorize = function( socketID ){
    // bind the emits to the socket from the config skele
};

var jSocketManager = (jSocketManager || new SocketManager());
module.exports = jSocketManager;
