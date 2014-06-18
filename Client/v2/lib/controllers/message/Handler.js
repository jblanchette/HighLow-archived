define(["require","underscore", "MessageConfig"],
 function(require, _, MessageConfig) {

    function Handler() {
        this.definitions = {};
    }

    Handler.prototype.preload = function() {
        var ConfigDefinitions = MessageConfig.getDefinitions();

        var _this = this;
        var cmdObj;

        _.each(ConfigDefinitions, function(cmdObject, emitKey) {

            _this.definitions[emitKey] = {};

            _.each(cmdObject, function(cmdFile, cmdName) {
                cmdObj = _this.definitions[emitKey][cmdName] = {};
                cmdObj.file = cmdFile;

                // We need to do an async callback require here
                // otherwise the module wont be loaded yet.
                
                require(["LOGIN/Login"], function(func){
                    _this.definitions[emitKey][cmdName].func = func;
                });
            });

        });

        console.log("Handler setup complete.");
    };

    Handler.prototype.getDefinitions = function() {
        return this.definitions;
    }

    Handler.prototype.setup = function(socket) {
        var _this = this;

        _.each(this.definitions, function(cmdObject, emitName) {
            socket.on(emitName, function(data) {
                console.log("Cmd Obj: ", cmdObject, "Emit Name: ", emitName);
                _this.exec.apply(_this,
                [emitName, data]);
            });
        });

        console.log("Handler emit bind setup complete.");
    };

    Handler.prototype.exec = function(emitName, emitObject) {
        var func;
        var _this = this;
        console.log("*************************");
        console.log("Exec: " + emitName + " with obj: ", emitObject);

        if (_.has(emitObject, "action")) {
            func = this.definitions[emitName][emitObject.action].func;

            console.log("Action: ", emitObject.action);
            console.log("Func: ", func);
            func.call(_this, emitObject);
        } else {
            console.log("*** ERROR *** could not find action in emitObject");
        }
    };

    var jHandler = (jHandler || new Handler());
    return jHandler;

});