define(
["socketio", "underscore", "jquery",
    "Handler", "Sender", "ClientModel"],
function(io, _, $, MessageHandler, MessageSender, ClientModel) {
    function Client() {
        this.socket = null;
        this.model = ClientModel;
        this.actions = [];
    }
    ;

    var jClient = (jClient || new Client());

    jClient.init = function() {
        MessageHandler.preload();
        this.setupUI();
    };

    jClient.connected = function() {
        if (this.socket) {
            return this.socket.socket.connected;
        } else {
            return false;
        }
    }

    jClient.setupUI = function() {

        // for now hook up a few buttons
        $("#toggle_register").click(function() {
            $("#toggle_register_box").toggle();
        });

        $("#button_connect").click(function() {
            jClient.connect();
        });

        $("#button_login").click(function() {
            var user = $("#loginUser").val();
            var pass = $("#loginPass").val();
            jClient.queue(jClient.login, [user, pass]);
        });

        $("#button_register").click(function(){
            var user = $("#registerUser").val();
            var pass = $("#registerPass").val();
            var location = $("#registerLocation").val();

            jClient.queue(jClient.register, [user,pass,location]);

        });

        console.log("UI setup complete.");
    };

    jClient.queue = function(func, args) {

        var _this = this;
        this.actions.push(function() {
            func.apply(_this, args);
        });

        if(jClient.connected()){
            jClient.runQueue();
        }else{
            jClient.connect();
        }
    };

    jClient.runQueue = function() {
        var _this = this;

        if (jClient.connected()) {
            _.each(this.actions, function(action) {
                action.apply(_this, null);
            });
        }
    };

    jClient.register = function(_user, _pass, _location){
        console.log("Calling register...");
        var RegisterObject = {
            action: "Register",
            username: _user,
            password: _pass,
            location: _location
        };

        MessageSender.emit("LOGIN",RegisterObject);
    };

    // @NOTE: Temporary code for testing. Will be performed by UI events.
    jClient.login = function(_user, _pass) {
        console.log("Running login>...");
        var LoginObject = {
            action : "Login",
            username : _user,
            password : _pass,
        };

        console.log("Sending Login Object: ", LoginObject);
        MessageSender.emit("LOGIN", LoginObject);

    };

    jClient.connect = function() {
        console.log("Connecting...");
        var _this = this;
        this.socket = io.connect("http://localhost:8080");
        this.socket.on('connect', _this.onConnect.bind(this));
        this.socket.on('disconnect', _this.onDisconnect.bind(this));
    };

    jClient.onConnect = function() {
        console.log("Connected. Setting handler binds.");
        MessageHandler.setup(this.socket);
        console.log("Setting Sender socket.");
        MessageSender.setup(this.socket);
        
        this.runQueue();
    };

    jClient.onDisconnect = function() {
        console.log("Disconnected: ", arguments);
    };


    return jClient;
});