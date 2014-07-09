var io = require('socket.io').listen(8080, {log: false}),
_ = require('underscore'),
MessageSender = require('./lib/controllers/message/Sender'),
MessageHandler = require('./lib/controllers/message/Handler'),
ChatManager = require('./lib/managers/ChatManager')
ClientManager = require('./lib/managers/ClientManager'),
LoginManager = require('./lib/managers/LoginManager'),
mongoose = require('mongoose');

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
        console.log("Query User collection...");
        var Users = require("./lib/models/User");
        Users.create({nickname: "Jeff", permissions: "ALL", rank: 1}, function(err, user){
            console.log("Err:", err);
            console.log("User:", user);
        });

    },

    handleConnection: function(socket){
        // @NOTE: Create security system for flooded attempts, ect.
        ClientManager.add( socket );
    }
};

Server.init();
