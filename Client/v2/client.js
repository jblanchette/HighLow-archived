define(['socketio', 'underscore', 'jquery', "Data", "Handler"],
 function(io, _, $, ClientData, MessageHandler){
    function Client(){
        this.socket = null;
    };

    Client.prototype.init = function(){
        console.log("Handler: ", MessageHandler);
        console.log("Data: ", ClientData);
        this.setupUI();
    };

    Client.prototype.setupUI = function(){
        var _ClientScope = this;
        $("#button_login").click(function(){
            _ClientScope.connect();
        });
    }



    Client.prototype.connect = function(){
        // connect, setup handler and sender
        var _this = this;

        this.socket = io.connect("http://localhost:8080");

        this.socket.on('connect', _this.onConnect.bind(this));
        this.socket.on('disconnect', _this.onDisconnect.bind(this));
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