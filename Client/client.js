define(
 ["socketio", "underscore", "jquery",
  "Handler", "Sender", "ClientModel","mongoose"],
 function(io, _, $, MessageHandler, MessageSender, ClientModel, mongoose){
    function Client(){
        this.socket = null;
        this.model = ClientModel;
    };

    Client.prototype.init = function(){
        MessageHandler.preload();
        this.setupUI();
    };

    Client.prototype.setupUI = function(){

        // for now hook up a few buttons

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

    // @NOTE: Temporary code for testing. Will be performed by UI events.
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

    var jClient = (jClient || new Client());
    return jClient;
});