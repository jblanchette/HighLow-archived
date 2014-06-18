define(['underscore'], function(_) {
    var jChatLobby = function( chatID, lobbyObj ) {
        _.defaults( this, lobbyObj );
        this.messages = [];
        this.chatID = chatID;
    };

    var jc = jChatLobby.prototype;

    return jChatLobby;
});