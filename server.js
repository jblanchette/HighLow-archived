
var io = require('socket.io').listen(8080),
_ = require('underscore'),
ChatLobby = require('./chatlobby').ChatLobby,
LoginManager = require('./loginmanager').LoginManager,
pg = require('pg');

var pgConnectionString = "pg://postgres:hello1@localhost/postgres";

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
    handleChatMsg : function(msg) {

    },
    handleGameMsg : function(msg) {

    }

};

Server.init();


io.sockets.on("connection", Server.handleConnection);

