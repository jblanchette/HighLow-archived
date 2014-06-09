
function MessageConfig() {

    this.definitions = {
        "LOGIN" : {
            "Login" : "./../login/Login",
            "Logout" : "./../login/Logout"
        },
        "CHAT" : {
            "Join" : "./../chat/Join",
            "Leave" : "./../chat/Leave",
            "Make" : "./../chat/Make",
            "NewMsg" : "./../chat/NewMsg",
            "SpecialFunc" : "./../chat/SpecialFunc"
        }
    };

};

MessageConfig.prototype.getDefinitions = function() {
    return this.definitions;
};

// not sure why you'd use this but its here in case
MessageConfig.prototype.addDefinition = function(emitName, actionName, actionFile) {
    this.definitions[emitName] = {actionName : actionFile};
};

module.exports = new MessageConfig();

