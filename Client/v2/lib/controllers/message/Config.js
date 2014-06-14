
function MessageConfig() {

    this.definitions = {
        "LOGIN" : {
            "Login" : "",
            "Logout" : ""
        },
        "CHAT" : {
            "Join" : "",
            "Leave" : "",
            "Make" : "",
            "NewMsg" : "",
            "Func" : ""
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

