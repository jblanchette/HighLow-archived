define([], function() {


    function MessageConfig() {

        this.definitions = {
            "LOGIN" : {
                "Login" : "../login/Login",
                "Logout" : "./../login/Logout"
            },
            "CHAT" : {
                "Join" : "./../chat/Join",
                "Leave" : "./../chat/Leave",
                "Make" : "./../chat/Make",
                "NewMsg" : "./../chat/NewMsg",
                "Func" : "./../chat/Func"
            }
        };

    }
    ;

    MessageConfig.prototype.getDefinitions = function() {
        return this.definitions;
    };

// not sure why you'd use this but its here in case
    MessageConfig.prototype.addDefinition = function(emitName, actionName, actionFile) {
        this.definitions[emitName] = {actionName : actionFile};
    };

    var jMessageConfig = (jMessageConfig || new MessageConfig());

    return jMessageConfig

});

