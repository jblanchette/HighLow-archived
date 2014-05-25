// Start the main app logic.
requirejs(['socketio', 'underscore','client','chatlobby'],
    function( io, _ , Client, ChatLobby ) {
        Client.init();

        var login = document.getElementById("button_login");
        login.addEventListener("click", function(){
            Client.login();
        });
    }
);