
var _ = require("underscore"),
MessageConfig = require("./message/Config"),
MessageHandler = require("./message/Handler"),
MessageSender = require("./message/Sender");

function MessageController(){
    this.ConfigDefinitions = MessageConfig.getDefinitions();
    this.definitions = {};
};

MessageController.prototype.init = function() {
    var _this = this;
    var cmdObj;

    _.each(_this.ConfigDefinitions, function(cmdObject, emitKey) {

        _this.definitions[emitKey] = {};

        _.each(cmdObject, function(cmdFile, cmdName) {

            cmdObj = _this.definitions[emitKey][cmdName] = {};
            cmdObj.file = cmdFile;
            cmdObj.func = require(cmdFile);
        });

    });

};

MessageController.prototype.getHandler = function( emitName, cmdName ){
    return this.definitions[emitName][cmdName].func;
};

MessageController.prototype.handleMessage = function( socket, msg ) {
    console.log("Ran!");
};

module.exports = new MessageController();