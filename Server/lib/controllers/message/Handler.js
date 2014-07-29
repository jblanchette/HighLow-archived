var _ = require("underscore");

function Handler() {
    this.definitions = {
        "LOGIN": ["Login", "Logout", "Register"],
        "CHAT": ["Join", "Leave", "Make", "NewMsg", "Func"]
    };
}

Handler.prototype.getDefinitions = function() {
    return this.definitions;
}

Handler.prototype.preload = function() {

    var _this = this;
    var cmdObj;
    var emitFolder;

    _.each(_this.definitions, function(cmdObject, emitKey) {

        emitFolder = emitKey.toLowerCase();
        _this.definitions[emitKey] = {};

        _.each(cmdObject, function(cmdName) {
            _this.definitions[emitKey][cmdName] =
                require("../" + emitFolder + "/" + cmdName);
        });

    });

};

Handler.prototype.setupLoginHandler = function ( socket ){
    console.log("Setting Login Handler for ", socket.id);
    var _this = this;
    socket.on("LOGIN", function( data ){
        _this.exec.apply(_this, [ socket, "LOGIN", data]);
    });
};

Handler.prototype.setupClientHandlers = function ( socket ){
    console.log("Setting up handlers...");
};

Handler.prototype.exec = function(socket, emitName, emitObject) {
    var func;
    var _this = this;
    console.log("*************************");
    console.log("Exec: " + emitName + " with action: ", emitObject.action);
    if (_.has(emitObject, "action")) {
        func = this.definitions[emitName][emitObject.action];

        // If a function takes one argument, it only wants the data,
        // otherwise takes two arguments  Wit also requires the socket.

        // Function.length returns how many arguments a function expects.
        if (func.length === 1) {
            func.call(_this, emitObject);
        } else {
            func.apply(_this, [socket.id, emitObject]);
        }

    } else {
        console.log("*** ERROR *** could not find action in emitObject");
    }
};

var jHandler = (jHandler || new Handler());

module.exports = jHandler;