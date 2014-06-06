
var _ = require("underscore"),
MessageConfig = require("./message/Config").MessageConfig,
MessageHandler = require("./message/Handler"),
MessageSender = require("./message/Sender");

function MessageController() {
    this.msgDef = MessageConfig.getDefinitions();

    /*
     *
     *

     */
}
;

MessageController.prototype.init = function() {
    var _this = this;
    _.each(_this.msgDef, function(cmdObject, emitKey) {

        _.each(cmdObject, function(cmdFile, cmdName) {
            cmdObject[cmdName].func = require(cmdFile);
        });

    });
};

MessageController.prototype.handleMessage = function() {
    console.log("Ran!");
};

module.exports = new MessageController();