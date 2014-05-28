// Start the main app logic.
requirejs(['socketio', 'underscore','client','chatlobby'],
    function( io, _ , Client, ChatLobby ) {
        Client.init();
        var getEl = function( id ) { return document.getElementById(id); };

        var login = getEl("button_login");
        login.addEventListener("click", function(){
            Client.login();
        });

        /*var send = getEl("button_sendChat");
        send.addEventListener("click", function(){
            Client.sendMessage();
        });*/

        var adminInput = getEl("adminInput");
        var adminKick = getEl("button_kickUser");

        adminKick.addEventListener("click",function(){
            console.log("Kicking user: ", adminInput.value);
            
            Client.adminFunc("kick", adminInput.value);
        });

    }
);