var MessageHandler = require("../controllers/message/Handler");

function SocketInstance(socket){
    var _this = this;
    this.authorized = false;
    this._socket = socket;

    return this._socket;
}

module.exports = SocketInstance;
