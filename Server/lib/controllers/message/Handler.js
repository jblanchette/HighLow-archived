var _ = require("underscore");

function Handler() {
    this.definitions = {};
}

Handler.prototype.getDefinitions = function(){
    return this.definitions;
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

        // If a function takes one argument, it only wants the data,
        // otherwise takes two arguments  Wit also requires the socket.

        // Function.length returns how many arguments a function expects.
        if(func.length === 1){
            func.call(_this, emitObject);
        }else{
            func.apply(_this, [socket, emitObject]);
        }
        
    }else{
        console.log("*** ERROR *** could not find action in emitObject");
    }
};

var jHandler = (jHandler || new Handler());
module.exports = jHandler;