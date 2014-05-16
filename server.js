var WebSocketServer = require('ws').Server,
    _ = require('underscore'),
    ChatLobby = require('./chatlobby').ChatLobby,
    LoginManager = require('./loginmanager').LoginManager,
    pg = require('pg');

var pgConnectionString = "pg://postgres:hello1@localhost/postgres";
var wss = new WebSocketServer({port: 8080});

var Server = {

    authUsers: [],
    chatRooms: [],
    gameLobbies: [],

    init: function(){
        console.log("**** STARTING SERVER ****");
        // Start with one chat lobby
        this.chatRooms.push ( new ChatLobby() );
    },

    /**
     * Takes in a return socket and generates a Unique ID for the connection
     *
     * @param {type} returnSocket
     * @returns {String} ClientUID
     */
    store: function( returnSocket ){

    },

    sendTo: function ( UID, message, flags ){

    },

    handleMessage: function( returnSocket, message, flags ){
        try {
            var msgObj = JSON.parse(message);
            var funcName = "handle" + msgObj.type;
            if(_.isFunction(this[funcName])){
                console.log("Performing " + funcName);
                this['handle' + msgObj.type](returnSocket, msgObj);
            }

        } catch (e){
            console.log("Syntax Error in message: ", e);
        }

    },

    handleLogin: function ( returnSocket, msg ){
        var loginObject = {
            username: msg.user,
            password: msg.pass
        };

        var loginResult;
        var loginUID;


        pg.connect(pgConnectionString, function(err, client, done) {
            client.query('SELECT * FROM users', function(err, result) {

                if( err ){
                    return console.log("PG Error in login" , err);
                }

                loginResult = _.findWhere(result.rows,loginObject);

                if(loginResult !== undefined){
                    console.log("Calling Create ",LoginManager);
                    loginUID = LoginManager.create( returnSocket );
                    console.log("Valid login found! New UID: ", loginUID);

                    var returnObj = {
                        type: "UID",
                        uID: loginUID
                    };

                    returnSocket.send(JSON.stringify(returnObj));


                }else{
                    console.log("Not valid login.");
                    var returnObj = {
                        type: "InvalidLogin"
                    };

                    returnSocket.send(JSON.stringify(returnObj));
                }

                done();
            });
        });

    },

    handleJoinDefaultChat: function ( returnSocket, msg ){
        for( room in this.chatRooms){
           
        }
    },

    handleGame: function ( returnSocket, msg ){

    }

};

Server.init();


wss.on('connection', function(ws) {

    ws.on('message', function(message,flags) {
        Server.handleMessage(ws,message,flags);
    });

});