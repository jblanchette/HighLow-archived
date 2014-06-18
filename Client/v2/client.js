define(['socketio', 'underscore', 'jquery', "Handler", "Sender", "ClientModel"],
 function(io, _, $, MessageHandler, MessageSender, ClientModel){
    function Client(){
        this.socket = null;
        this.model = ClientModel;
    };

    Client.prototype.init = function(){
        this.setupUI();
    };

    Client.prototype.setupUI = function(){
        var _ClientScope = this;
        $("#button_connect").click(function(){
            _ClientScope.connect();
        });

        $("#button_login").click(function(){
           var user = $("#loginUser").val();
           var pass = $("#loginPass").val();

           _ClientScope.login( user, pass );
        });
        console.log("UI setup complete.");
    };

    // @TODO: ***Possibly just use an event from the UI for things such as this.
    //        This is really just for testing/client purposes. Should be
    //         looked into. ***
    Client.prototype.login = function( _user, _pass ){
        var LoginObject = {
            action: "Login",
            user: _user,
            pass: _pass,
        };

        console.log("Sending Login Object: ", LoginObject);
        MessageSender.emit("LOGIN", LoginObject);

    };



    Client.prototype.connect = function(){
        console.log("Connecting...");
        // connect, setup handler and sender
        var _this = this;

        this.socket = io.connect("http://localhost:8080");

        this.socket.on('connect', _this.onConnect.bind(this));
        this.socket.on('disconnect', _this.onDisconnect.bind(this));
    };

    Client.prototype.onConnect = function(){
        console.log("Connected. Setting handler binds.");
        MessageHandler.setup(this.socket);
        console.log("Setting Sender socket.");
        MessageSender.setup(this.socket);
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