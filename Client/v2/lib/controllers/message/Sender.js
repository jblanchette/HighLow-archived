define(["underscore"], function(_) {

    function Sender() {

    }

    Sender.prototype.emit = function(roomName, emitName, emitObject) {
        console.log("Sender.emit: ", emitName, emitObject);
        this.io.sockets.in(roomName).emit(emitName, emitObject);
    };

    var jSender = (jSender || new Sender());

    module.exports = jSender;

});