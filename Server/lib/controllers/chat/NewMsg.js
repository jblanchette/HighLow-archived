var MessageSender = require("../message/Sender"),
    ChatManager = require("../../managers/ChatManager");

function NewMsg( msg ){
    var Lobby = ChatManager.get(msg.roomID);
    Lobby.addMessage( msg.data );
}

module.exports = NewMsg;