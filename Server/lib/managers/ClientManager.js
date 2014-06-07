var _ = require("underscore"),
    ClientInstance = require("../client/Client");

function ClientManager(){
    this.clients = {};
}

ClientManager.prototype.add = function( socket ){
    var nClient = new ClientInstance( socket );
    this.clients[socket.id] = nClient;
};

ClientManager.prototype.get = function( socketID ){
    return this.clients[socketID];
};

ClientManager.prototype.getBy = function( key, value ){
    return _.findWhere(this.clients, {key: value});
};

module.exports = new ClientManager();