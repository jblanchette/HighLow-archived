define(["require", "underscore"],
function(require, _) {

    function Handler() {

        this.definitions = {};

        this.ConfigDefinitions = {
            "LOGIN": ["Login", "Logout", "Register"],
            "CHAT": ["Join", "Leave", "Make", "NewMsg", "Func"]
        };
    }

    Handler.prototype.preload = function() {

        var _this = this;
        var cmdObj;

        _.each(this.ConfigDefinitions, function(cmdList, emitKey) {

            _this.definitions[emitKey] = {};

            _.each(cmdList, function(cmdName) {
                _this.definitions[emitKey][cmdName] = function(){};

                require([emitKey + "/" + cmdName], function(func) {
                    _this.definitions[emitKey][cmdName] = func;
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

        _.each(_.keys(this.ConfigDefinitions), function(emitName) {
            socket.on(emitName, function(data) {
                _this.exec.apply(_this, [emitName, data]);
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
            func = this.definitions[emitName][emitObject.action];

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