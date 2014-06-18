define(["underscore", "MessageConfig"], function(_, MessageConfig) {

    function Handler() {
        this.definitions = {};
        var ConfigDefinitions = MessageConfig.getDefinitions();

        var _this = this;
        var cmdObj;

        _.each(ConfigDefinitions, function(cmdObject, emitKey) {

            _this.definitions[emitKey] = {};

            _.each(cmdObject, function(cmdFile, cmdName) {
                cmdObj = _this.definitions[emitKey][cmdName] = {};
                cmdObj.file = cmdFile;
                cmdObj.func = function(){}; //require(cmdFile);
            });

        });

        console.log("Handler setup complete.");

    }

    Handler.prototype.getDefinitions = function() {
        return this.definitions;
    }

    Handler.prototype.setup = function( socket ){
        var _this = this;

        _.each(this.definitions, function( cmdObject, emitName){
           _.each(cmdObject, function( actionObject, actionName){

                socket.on(emitName, function(data) {
                    _this.exec.apply(_this,
                        [emitName, data]);
                });

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
            func.call(_this, emitObject);
        } else {
            console.log("*** ERROR *** could not find action in emitObject");
        }
    };

    var jHandler = (jHandler || new Handler());
    return jHandler;

});