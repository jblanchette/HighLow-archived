
var _ = require("underscore"),
MessageHandler = require("./message/Handler"),
MessageSender = require("./message/Sender");

function MessageController(){
    this.test = 0;
};

MessageController.prototype.getHandler = function(){
    return MessageHandler;
};

MessageController.prototype.getSender = function(){
    return MessageSender;
};

var jMessageController = (jMessageController || new MessageController());
module.exports = jMessageController;