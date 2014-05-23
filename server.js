var WebSocketServer = require('ws').Server,
    _ = require('underscore'),
    ChatLobby = require('./chatlobby').ChatLobby,
    LoginManager = require('./loginmanager').LoginManager,
    pg = require('pg');

var pgConnectionString = "pg://postgres:hello1@localhost/postgres";
var wss = new WebSocketServer({port: 8080});

var Server = {

    debug: true,
    authUsers: [],
    chatRooms: [],
    gameLobbies: [],

    init: function(){
        console.log("**** STARTING SERVER ****");
        // Start with one chat lobby
        this.chatRooms.push ( new ChatLobby() );
    },

    events: {
        'LOGIN': this.handleLogin,
        'CHAT':  this.handleChatMsg,
        'GAME':  this.handleGameMsg
    },

    error: function ( e ) {
        console.log("********* Error **********");
        console.log(e);

        if(this.debug){
            debugger;
        }
    },

    handleMessage: function( returnSocket, message, flags ){
        try {

            var msgObj = JSON.parse(message);

            if(_.has(this.events,msgObj.type)){

                /**
                 * Only the login message needs the returnSocket.
                 * All other messages require a UID of the client which
                 * points to the socket instance.
                 */
                if(msgObj.type === "LOGIN"){
                    this.events['LOGIN'](returnSocket, msgObj);
                }else{
                    this.events[msgObj.type](msgObj);
                }
            }

        } catch (e){
            this.error(e);
        }

    },

    handleLogin: function ( returnSocket, msg ){

    },

    handleChatMsg: function ( msg ){

    },

    handleGameMsg: function ( msg ){

    }

};

Server.init();


wss.on('connection', function(ws) {

    ws.on('message', function(message,flags) {
        Server.handleMessage(ws,message,flags);
    });

});