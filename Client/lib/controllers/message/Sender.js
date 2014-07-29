define([], function() {

    function Sender( socket ) {
        this.socket = null;
    }

    Sender.prototype.setup = function( socket ){
        this.socket = socket;
    };

    Sender.prototype.emit = function(emitName, emitObject) {
        this.socket.emit(emitName, emitObject);
    };

    var jSender = (jSender || new Sender());

    return jSender;

});