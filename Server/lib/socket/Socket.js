var MessageHandler = require("../controllers/message/Handler");

function SocketInstance(socket){
    var _this = this;
    this.authorized = false;
    this._socket = socket;

    this._socket.on("LOGIN", function( data ){
        console.log("Handler: ", MessageHandler);
        MessageHandler.exec.apply(MessageHandler, [_this._socket.id, "LOGIN", data]);
    });

    return this._socket;
}

module.exports = SocketInstance;
