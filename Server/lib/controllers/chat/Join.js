var MessageSender = require("../message/Sender"),
    ClientManager = require("../../managers/ClientManager"),
    ChatManager = require("../../managers/ChatManager");

function Join( socketID, msg ){
    if(msg.roomID === "ANY"){
        msg.roomID = ChatManager.getVacantLobby();
    }

    var nClient = ClientManager.get(socketID);

    ChatManager.addToRoom( msg.roomID, nClient);
}

module.exports = Join;