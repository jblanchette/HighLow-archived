var ClientData = require("./Client.Data"),
SocketManager = require("../managers/SocketManager");

function Client( socket ){
    // To save memory on bad logins or attacks, clients are only
    // a boolean for authorized until they become authorized.
    this.authorized = false;

    this.socket = SocketManager.add(socket);
}

Client.prototype.send = function( emitKey, emitObject ){
    this.socket.emit( emitKey, emitObject );
};

Client.prototype.authorize = function(){
    this.authorized = true;

    // Now setup the extra information about the Client

    // @NOTE: I figured we could leave some room to implement the ORM
    //        or just have a simple data adapater here so games /plugins
    //        can access client data.

    this.data = new ClientData();
};

module.exports = Client;