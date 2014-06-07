
var SocketInstance = require("../socket/Socket");

function SocketManager(){
    this.sockets = {};
};

SocketManager.prototype.add = function(ioSocket) {

    var socket = new SocketInstance(ioSocket);
    this.sockets[socket.id] = socket;

    return socket;
};

SocketManager.prototype.authorize = function( socketID ){
    // bind the emits to the socket from the config skele
};

module.exports = new SocketManager();
