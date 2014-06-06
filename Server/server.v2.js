var io = require('socket.io').listen(8080, {log: false}),
_ = require('underscore'),
MessageController = require('lib/controllers/Message');

var Server = {
    
    init: function(){
        io.sockets.on("connection", Server.handleConnection);
    },

    handleConnection: function(socket){
        // @NOTE: Create security system for flooded attempts, ect.


    }
};

Server.init();
