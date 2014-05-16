
var Client = {
    debug: true,
    dElement: null,
    uID: null,
    socket: null,
    socketReady: false,


    init: function(){
        console.log("Initalized Client");
        if(this.debug){
            this.dElement = document.getElementById("messages");
        }
    },

    login: function() {
        console.log("Running login()");

        if(!this.socketReady){
            var _this = this;
            this.debugMsg("Socket not ready, Calling Setup()");
            this.setup( _this.login );
            return;
        }

            this.debugMsg("Socket Ready!");

            var msg = {
                type: "Login",
                user: "test",
                pass: "test"
            };
            console.log("Sending to socket.")
            this.socket.send(JSON.stringify(msg));

    },


    handleUID: function ( msg ) {
        console.log("Got UID from server: ", msg.uID);
        this.uID = msg.uID;
        this.updateStatus("logged_in","True");
    },

    handleJoinChatRoom: function( msg ){
        // ID, Name, Members, Topic
        console.log("Joining Chat Room: " + msg.RoomName);
    },

    handleInvalidLogin: function ( msg ){
        console.log("Invalid Login sent from Server.");
    },

    joinDefaultChat: function ( msg ){
        var msg = {
            type: "JoinDefaultChat",
            uID: this.uID
        }

        this.send(JSON.stringify(msg));
    },

    onOpen: function (callback, e){
        console.log("Socket.onOpen", arguments);

        if(this.socket.readyState === 1){
            console.log("calling update status");
            this.socketReady = true;
            this.updateStatus("connected", "True");

            if(_.isFunction(callback)){
                console.log("Running onOpen callback");
                callback();
            }
        }



    },

    onMessage : function(e) {
        console.log("Got Message: ", e);

        var message = e.data;

        if (this.debug) {
            this.debugMsg(message);
        }


        var msgObj = JSON.parse(message);
        var funcName = "handle" + msgObj.type;

        if (_.isFunction(this[funcName])) {
            console.log("Performing " + funcName);
            this['handle' + msgObj.type](msgObj);
        }



    },

    setup: function( callback ){
        if(this.socket !== null){
            console.log("Socket already setup");
            return;
        }
        console.log("Calling Setup()");
        this.socket = new WebSocket("ws://localhost:8080");

        this.socket.onopen = _.bind(this.onOpen, this, callback.bind(this));
        this.socket.onmessage = this.onMessage.bind(this);
    },

    send: function ( msg ){

        if(this.socketReady){
            console.log("Sending msg: ", msg);
            this.socket.send( msg );
        }
    },

    debugMsg: function ( msg ){
        if(this.debug){
            this.dElement.innerHTML += msg + "<br>";
        }
    },

    updateStatus: function ( name, value ){
        var element = document.getElementById(name);
        if(element){
            element.innerHTML = value;
        }
    }
};