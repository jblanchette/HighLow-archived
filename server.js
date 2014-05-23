var io = require('socket.io').listen(8080),
    _ = require('underscore'),
    ChatLobby = require('./chatlobby').ChatLobby,
    LoginManager = require('./loginmanager').LoginManager,
    pg = require('pg');

var pgConnectionString = "pg://postgres:hello1@localhost/postgres";

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

    handleConnection: function ( socket ) {
        var _this = this;
        socket.on('message', function( msg, flags ){
            _this.handleMessage( socket, msg, flags );
        });
    },

    handleMessage: function( returnSocket, data ){
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

    handleLogin : function(returnSocket, msg) {
        var result = LoginManager.login(returnSocket, msg);

        if (result === false) {
            var returnObj = {
                type : "InvalidLogin"
            };

            returnSocket.send(JSON.stringify(returnObj));
        } else {
            var returnObj = {
                type : "UID",
                uID : loginUID
            };

            returnSocket.send(JSON.stringify(returnObj));
        }
    },

    handleChatMsg: function ( msg ){

    },

    handleGameMsg: function ( msg ){

    }

};

Server.init();


io.sockets.on("connection", Server.handleConnection);