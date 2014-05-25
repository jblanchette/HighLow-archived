define(['underscore','chatlobby'], function(_, ChatLobby) {

    var jChatManager = function() {
        this.Client = null;
        this.Lobby = new ChatLobby();

    };

    var jp = jChatManager.prototype;

    jp.setup = function(client) {
        this.Client = client;
    };

    jp.joinLobby = function(msg) {
        console.log("Joining chat lobby!");
        try {
            var obj = JSON.parse(msg.room);
            console.log("Chat Obj: " + obj);
            this.Client.debugMsg("Joined Room: " + JSON.stringify(obj));
        } catch (e) {
            console.warn("Error in ChatManager.joinLobby", e);
        }
    };

    return new jChatManager();

});