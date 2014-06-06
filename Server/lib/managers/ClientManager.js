var ClientInstance = require("../client/Client");

function ClientManager(){
    this.clients = {};
}

ClientManager.prototype.addUnauthorizedClient = function( socket ){

}

module.exports = new ClientManager();