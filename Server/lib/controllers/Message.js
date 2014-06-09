
var _ = require("underscore"),
MessageConfig = require("./message/Config"),
MessageHandler = require("./message/Handler"),
MessageSender = require("./message/Sender");

function MessageController(){
    console.log("Setting Handler Definitions");
    MessageHandler.setDefinitions(MessageConfig.getDefinitions());
};

MessageController.prototype.getHandler = function(){
    return MessageHandler;
};

MessageController.prototype.getSender = function(){
    return MessageSender;
};

MessageController.prototype.handleMessage = function( socket, msg ) {
    console.log("Ran!");
};

module.exports = new MessageController();