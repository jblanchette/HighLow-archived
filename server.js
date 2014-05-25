
var io = require('socket.io').listen(8080, {log: false}),
_ = require('underscore'),
ChatManager = require('./chatmanager').ChatManager,
LoginManager = require('./loginmanager').LoginManager;

var Server = {
    debug : true,
    init : function() {
        console.log("**** STARTING SERVER ****");

        ChatManager.setup( io );
        LoginManager.setup( io );

        ChatManager.createRoom();
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
        _.each(Server.events, function(fn, name) {
            socket.on(name, function(data) {
                Server[fn].apply(_this, [socket, data]);
            })
        });
    },
    handleLogin : function(socket, msg) {
        console.log("handle login...");
        LoginManager.login(socket, msg);

    },
    handleChatMsg : function(socket, msg) {
        var _this = this;
        switch (msg.type) {
            case "JOIN":
                if (msg.roomName === "ANY") {
                    console.log("running ChatManager.joinDefault");
                    ChatManager.joinDefault.apply(ChatManager, [socket, socket.id]);
                }
                break;
        }
    },
    handleGameMsg : function(socket, msg) {

    }

};

Server.init();
io.sockets.on("connection", Server.handleConnection);

