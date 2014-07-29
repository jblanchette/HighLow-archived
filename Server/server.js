var io = require('socket.io').listen(8080, {log: false}),
_ = require('underscore'),
MessageSender = require('./lib/controllers/message/Sender'),
MessageHandler = require('./lib/controllers/message/Handler'),
ChatManager = require('./lib/managers/ChatManager')
ClientManager = require('./lib/managers/ClientManager'),
LoginManager = require('./lib/managers/LoginManager'),
mongoose = require('mongoose'),
UserModel = require('./lib/models/User');

var Server = {

    init: function(){

        MessageHandler.preload();

        console.log("Setting up socket.io conn handler");
        io.sockets.on("connection", Server.handleConnection);
        MessageSender.setIO(io);

        // Create server owned chat room
        ChatManager.create(-1, "Main Chat");
        console.log("Connecting to MongoDB");

        mongoose.connect('mongodb://localhost/test');

        mongoose.connection.on('open', function (ref) {
            console.log('Connected to mongo server.');
        });

    },

    handleConnection: function(socket){
        // @NOTE: Create security system for flooded attempts, ect.
        ClientManager.add( socket );
    }
};

Server.init();
