
function SocketInstance(socket){
    this.authorized = false;
    this._socket = socket;
    return this._socket;
}

module.exports = SocketInstance;
