
var io = require('socket.io').listen(8080, {log: false}),
_ = require('underscore'),
ChatManager = require('./chatmanager').ChatManager,
LoginManager = require('./loginmanager').LoginManager;

var Server = {
    debug : true,
    init : function() {
        console.log("**** STARTING SERVER ****");

        ChatManager.setup( io );
        ChatManager.createRoom();
        console.log("**** READY ****");
    },
    events : {
        'LOGIN' : 'handleLogin',
        'CHAT' : 'handleChatMsg',
        'GAME' : 'handleGameMsg'
    },
    error : function(e) {
        console.log("********* Error **********");
        console.log(e);

        if (this.debug) {
            debugger;
        }
    },
    handleConnection : function(socket) {
        var _this = this;

        socket.on('disconnect', function(){
            Server.handleDisconnect( socket );
        });

        _.each(Server.events, function(fn, name) {
            socket.on(name, function(data) {
                Server[fn].apply(_this, [socket, data]);
            })
        });
    },

    handleDisconnect: function ( socket ){
        console.log("Client Disconnect: ", socket.id);

        var nickname = LoginManager.getNickname( socket.id );
        ChatManager.userDisconnect( nickname );
    },

    handleLogin : function(socket, msg) {
        //console.log("handle login...");
        LoginManager.handleMessage.apply( LoginManager, [socket, msg] );

    },
    handleChatMsg : function(socket, msg) {
        //console.log("handle Chat Msg", msg);
        ChatManager.handleMessage.apply( ChatManager, [socket, msg] );

    },
    handleGameMsg : function(socket, msg) {

    }

};

Server.init();
io.sockets.on("connection", Server.handleConnection);

