define(['underscore'], function(_) {
    var jChatLobby = function( lobbyObj ) {
        _.defaults( this, lobbyObj );
        this.messages = [];
    };

    var jc = jChatLobby.prototype;

    return jChatLobby;
});