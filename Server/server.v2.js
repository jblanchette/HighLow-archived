var io = require('socket.io').listen(8080, {log: false}),
_ = require('underscore'),
MessageController = require('./lib/controllers/Message'),
ChatManager = require('./lib/managers/ChatManager')
ClientManager = require('./lib/managers/ClientManager'),
LoginManager = require('./lib/managers/LoginManager');

var Server = {

    init: function(){
        console.log("Setting up socket.io conn handler");
        io.sockets.on("connection", Server.handleConnection);

        MessageController.getSender().setIO(io);

        ChatManager.create(-1, "Main Chat");
    },

    handleConnection: function(socket){
        // @NOTE: Create security system for flooded attempts, ect.
        ClientManager.add( socket );
    }
};

Server.init();
