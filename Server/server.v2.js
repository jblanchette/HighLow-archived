var io = require('socket.io').listen(8080, {log: false}),
_ = require('underscore');

var Server = {
    init: function(){

    },

    setup: function(){

    },

    handleConnection: function(){

    }
};

Server.init();
io.sockets.on("connection", Server.handleConnection);