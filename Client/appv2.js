// Start the main app logic.
requirejs(['socketio', 'underscore','clientv2'],
    function( io, _ , Client ) {
        Client.init();
    }
);