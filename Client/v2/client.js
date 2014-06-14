define(['socketio', 'underscore', 'jquery', "lib/controllers/message/Handler"],
 function(io, _, $, MessageHandler){
    function Client(){
        this.socket = null;
    };

    Client.prototype.init = function(){
        console.log("Handler: ", MessageHandler);
    };



    Client.prototype.connect = function(){
        // connect, setup handler and sender
        var _this = this;

        this.socket = io.connect("http://localhost:8080");

        this.socket.on('connect', Client.onConnect.bind(this));
        this.socket.on('disconnect', Client.onDisconnect.bind(this));
    };

    Client.prototype.onConnect = function(){
        console.log("Connected: ", arguments);
    };

    Client.prototype.onDisconnect = function(){
        console.log("Disconnected: ", arguments);
    };

    Client.prototype.addHandler = function(emitName) {
        var _this = this;
        this.socket.on(emitName, function(data) {
            MessageHandler.exec.apply(MessageHandler, [emitName, data]);
        });
    };



    var jClient = (jClient || new Client());
    return jClient;
});