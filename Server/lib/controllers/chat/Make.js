var MessageSender = require("../message/Sender"),
    ClientManager = require("../../managers/ClientManager"),
    ChatManager = require("../../managers/ChatManager");

function Make( socketID, msg ){
    var nClient = ClientManager.get(socketID);

    // @TODO: When permissions are available, check against them in room opts
    var Lobby = ChatManager.create( nClient.id, msg.roomOptions );
    Lobby.addToRoom(nClient);
}

module.exports = Make;