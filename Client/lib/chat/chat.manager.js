define(['underscore', 'chatlobby', 'jquery'], function(_, ChatLobby, $) {

    var jChatManager = function() {
        this.Client = null;
        this.Lobbies = {};
        this.ServerLobbies = {};
        this.selectedLobby = "";
    };

    var jp = jChatManager.prototype;
    
    return new jChatManager();

});