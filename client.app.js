// Start the main app logic.
requirejs(['socketio', 'underscore','client'],
    function( io, _ , Client ) {
        Client.init();

        var login = document.getElementById("button_login");
        login.addEventListener("click", function(){
            Client.login();
        });
    }
);