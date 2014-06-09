var _ = require("underscore"),
    ClientData = require("./Client.Data"),
    SocketManager = require("../managers/SocketManager"),
    MessageHandler = require("../controllers/message/Handler");

function Client( socket ){
    // To save memory on bad logins or attacks, clients are only
    // a boolean for authorized until they become authorized.
    this.authorized = false;

    // Clients only have the LOGIN handler functions before authorization
    this.socket = SocketManager.add(socket);
    this.addHandler("LOGIN");

};

Client.prototype.addHandler = function(emitName){
    var _this = this;
    this.socket.on(emitName , function( data ){
        MessageHandler.exec.apply(MessageHandler, [_this.socket.id, emitName, data]);
    });
}

Client.prototype.authorize = function(){
    var _this = this;
    var definitions = MessageHandler.getDefinitions();
    var emitKeys = _.keys(definitions);
    this.authorized = true;

    // Now setup the extra information about the Client

    console.log("Authorizing client");
    _.each(emitKeys, function( emitKey ) {
        _this.addHandler( emitKey );
    });

    // @NOTE: I figured we could leave some room to implement the ORM
    //        or just have a simple data adapater here so games /plugins
    //        can access client data.

    this.data = new ClientData();
};



module.exports = Client;