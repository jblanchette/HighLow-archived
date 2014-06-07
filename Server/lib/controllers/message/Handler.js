var _ = require("underscore");

function Handler() {
    this.definitions = {};
}

Handler.prototype.setDefinitions = function(ConfigDefinitions) {
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

Handler.prototype.exec = function( socket, emitName, emitObject ){
    console.log("Exec: " + emitName + " with obj: ", emitObject);

    console.log("Func: ", this.definitions[emitName]);
};

module.exports = new Handler();