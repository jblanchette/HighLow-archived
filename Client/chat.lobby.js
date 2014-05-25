define(['underscore'], function(_) {
    var jChatLobby = function( lobbyObj ) {
        _.defaults( this, lobbyObj );
    };

    var jc = jChatLobby.prototype;

    return jChatLobby;
});