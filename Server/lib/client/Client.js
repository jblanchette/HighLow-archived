var _ = require("underscore"),
    ClientData = require("./Client.Data"),
    SocketManager = require("../managers/SocketManager"),
    MessageHandler = require("../controllers/message/Handler"),
    Util = require("../util/Util");

function Client( socket ){

    this.id = -1;
    this.nickname = "";
    // To save memory on bad logins or attacks, clients are only
    // a boolean for authorized until they become authorized.
    this.authorized = false;

    // Clients only have the LOGIN handler functions before authorization
    this.socket = SocketManager.add(socket);
    MessageHandler.setupLoginHandler( socket );

};

Client.prototype.getSocket = function(){
    return this.socket;
};

Client.prototype.authorize = function(){
    var _this = this;
    var definitions = MessageHandler.getDefinitions();
    var emitKeys = _.keys(definitions);
    this.authorized = true;

    // Now setup the extra information about the Client
    console.log("Authorizing client");

    // For now we just assign a random id, but it'll be a database id
    this.id = Util.generateID();
    this.nickname = "Client-" + this.id;

    // Setup socket emit handlers
    MessageHandler.setupClientHandlers( this.socket );

    this.data = new ClientData();
};



module.exports = Client;