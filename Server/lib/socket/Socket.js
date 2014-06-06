
var jSocketInstance = function(socket) {
    this.authorized = false;
    this._socket = socket;
    return this._socket;
};

exports.Socket = jSocketInstance;
