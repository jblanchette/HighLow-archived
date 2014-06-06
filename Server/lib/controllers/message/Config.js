
    var jMessageConfig = function() {

        this.definitions = {
            "LOGIN" : {
                "Login" : "./login/Login",
                "Logout" : "./login/Logout"
            },
            "CHAT" : {
                "Join" : "./chat/Join",
                "Leave" : "./chat/Leave",
                "Make" : "./chat/Make",
                "NewMsg" : "./chat/NewMsg",
                "SpecialFunc" : "./chat/SpecialFunc"
            }
        };

    };

    jMessageConfig.prototype.getDefinitions = function(){
        return this.definitions;
    };

    // not sure why you'd use this but its here in case
    jMessageConfig.prototype.addDefinition = function( emitName, actionName, actionFile ){
        this.definitions[emitName] = {actionName: actionFile};
    };

    exports.MessageConfig = new jMessageConfig();

