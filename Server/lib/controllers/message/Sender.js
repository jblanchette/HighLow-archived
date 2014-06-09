var _ = require("underscore"),
    io = require("socket.io"),
    SocketManager = require("./../../managers/SocketManager");

function Sender() {

}

/**
 * send is used to emit to a specific client, based on a given socket ID.
 *
 * Note: to get the socketID, ask the ClientManager based on the userID.
 * The server acquires the socketID automatically for some core functionality
 * like the Login server.
 *
 * @param {String} socketID
 * @param {String} emitName
 * @param {Object} emitObject
 * @returns {Boolean}
 */
Sender.prototype.send = function( socketID, emitName, emitObject ){
    console.log("Sender.send: ", socketID, emitName, emitObject);
    var socket = SocketManager.get(socketID);
    if(socket !== undefined){
        socket.emit(emitName, emitObject);
        return true;
    }else{
        console.log("*** ERROR *** Could not find socketID: ", socketID);
        return false;
    }

};

Sender.prototype.emit = function( roomName, emitName, emitObject ){
    console.log("Sender.emit: ", emitName, emitObject);
    io.sockets.in(roomName).emit(emitName, emitObject);
};

var jSender = (jSender || new Sender());

module.exports = jSender;