// Start the main app logic.
requirejs(['socketio', 'underscore','client','chatlobby'],
    function( io, _ , Client, ChatLobby ) {
        Client.init();
    }
);