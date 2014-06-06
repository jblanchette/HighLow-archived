
var SocketInstance = require("../socket/Socket");

function SocketManager(){
    this.sockets = {};
};

SocketManager.prototype.add = function(ioSocket) {

    var socket = new SocketInstance(ioSocket);
    this.sockets[socket.id] = socket;

    return socket;
}

module.exports = new SocketManager();
