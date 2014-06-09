var _ = require("underscore");

function Handler() {
    this.definitions = {};
}

Handler.prototype.setDefinitions = function(ConfigDefinitions) {
    var _this = this;
    var cmdObj;
    console.log("Set handler definitions!");
    _.each(ConfigDefinitions, function(cmdObject, emitKey) {

        _this.definitions[emitKey] = {};

        _.each(cmdObject, function(cmdFile, cmdName) {
            cmdObj = _this.definitions[emitKey][cmdName] = {};
            cmdObj.file = cmdFile;
            cmdObj.func = require(cmdFile);
        });

    });

};

Handler.prototype.exec = function( socket, emitName, emitObject ){
    var func;
    var _this = this;
    console.log("*************************");
    console.log("Exec: " + emitName + " with obj: ", emitObject);
    if(_.has(emitObject,"action")){
        func = this.definitions[emitName][emitObject.action].func;
        func.apply(_this, [socket, emitObject]);
    }
};

console.log("jHandler check:", jHandler);
var jHandler = (jHandler || new Handler());
console.log("jHandler after check:", jHandler);

module.exports = jHandler;