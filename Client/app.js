// Start the main app logic.
requirejs(['socketio', 'underscore','client','chatlobby','msg'],
    function( io, _ , Client, ChatLobby, msg ) {
        Client.init();
    }
);