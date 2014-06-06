var io = require('socket.io').listen(8080, {log: false}),
_ = require('underscore'),
MessageController = require('./lib/controllers/Message'),
SocketManager = require('./lib/managers/SocketManager'),
LoginManager = require('./lib/managers/LoginManager');

var Server = {

    init: function(){
        console.log("Running MC.init()");
        MessageController.init();
        console.log("Setting up socket.io conn handler");
        io.sockets.on("connection", Server.handleConnection);
    },

    handleConnection: function(socket){
        // @NOTE: Create security system for flooded attempts, ect.

        var SocketInstance = SocketManager.add( socket );

        SocketInstance.on("LOGIN", 
            MessageController.getHandler.apply(MessageController,["LOGIN","Login"]));
    }
};

Server.init();
