
var io = require('socket.io').listen(8080),
_ = require('underscore'),
ChatLobby = require('./chatlobby').ChatLobby,
LoginManager = require('./loginmanager').LoginManager;

var Server = {
    debug : true,
    authUsers : [],
    chatRooms : [],
    gameLobbies : [],
    init : function() {
        console.log("**** STARTING SERVER ****");
        // Start with one chat lobby
        this.chatRooms.push(new ChatLobby());
    },
    events : {
        'LOGIN' : 'handleLogin',
        'CHAT' :  'handleChatMsg',
        'GAME' :  'handleGameMsg'
    },
    error : function(e) {
        console.log("********* Error **********");
        console.log(e);

        if (this.debug) {
            debugger;
        }
    },

    handleConnection : function(socket) {
        _.each(Server.events, function ( fn, name ){
           socket.on(name, function( data ) {
               Server[fn](socket, data);
           })
        });
    },

    handleLogin : function( socket, msg) {

        console.log("PERFORMING LOGIN", msg);

        var result = LoginManager.login( socket, msg);

    },
    handleChatMsg : function( socket, msg) {
        switch(msg.type){
            case "JOIN":
                if(msg.roomName === "ANY"){
                    // Join first default chat available
                    console.log("Joining first avaiable chat for " + socket.id);
                }
            break;
        }
    },
    handleGameMsg : function( socket, msg) {

    }

};

Server.init();


io.sockets.on("connection", Server.handleConnection);

