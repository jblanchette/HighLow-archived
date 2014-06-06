
var SocketInstance = require("../socket/Socket");

var jSocketManager = function() {
    this.sockets = {};
};

var jp = jSocketManager.prototype;

jp.add = function(ioSocket) {

    var socket = new SocketInstance(ioSocket);
    this.sockets[socket.id] = socket;

    return socket;
}

exports.SocketManager = new jSocketManager;
