define(['socketio', 'underscore', 'chatmanager'], function(io, _, ChatManager) {

    var Client = {
        debug : true,
        domElements :
        ["messages", "loginUser", "loginPass",
            "chatInput", "chatMessages", "chatList",
            "chatHeader"],
        elements : {},
        nickname: "",
        emitQueue : [],
        socket : null,
        events : {
            'LOGIN' : 'handleLogin',
            'CHAT' : 'handleChatMsg',
            'GAME' : 'handleGameMsg'
        },
        init : function() {
            console.log("Initalized Client");
            _this = this;
            _.map(this.domElements, function(el) {
                _this.elements[el] = document.getElementById(el);
                if (_this.elements[el] === undefined) {
                    console.warn("Could not find DOM Element: " + el);
                }
            });

            ChatManager.setup( this );

            this.debugMsg("Started Client");

            this.getDom("loginUser").value = "User#" + Math.floor((Math.random() * 10000) + 1);
        },
        /**
         * Get the DOM Element instance of the given ID.
         *
         * @param {String} id
         * @returns {DOM Element}
         */
        getDom : function(id) {
            return this.elements[id];
        },
        setup : function(callback) {
            console.log("Calling setup");
            _this = this;
            this.socket = io.connect("http://76.127.128.136:8080");

            _.each(Client.events, function(fn, name) {
                _this.socket.on(name, function(data) {
                    Client[fn].apply(_this, [data]);
                })
            });

            this.socket.on('connect', Client.onConnect);
        },
        queue : function(emitName, emitObj) {

            this.emitQueue.push({
                name : emitName,
                obj : emitObj
            });


            if (this.socket !== null && this.socket.socket.connected) {
                this.runQueue();
            }
        },
        runQueue : function() {
            if (!this.socket.socket.connected) {
                console.warn("Tried to run queue without being connected.");
                return false;
            }
            _.each(this.emitQueue, function(e) {
                console.log("Sending message in queue", e);
                Client.socket.emit(e.name, e.obj);
            });

            this.emitQueue = [];
        },
        onConnect : function() {
            console.log("onConnect called");
            Client.runQueue();
        },

        handleLogin : function(data) {

            if (data.type === "GOOD") {
                this.nickname = data.nickname;

                this.debugMsg("Asking server to join chat.");

                var ChatObject = {
                    type : "JOIN",
                    roomName : "ANY"
                };

                this.socket.emit("CHAT", ChatObject);
            } else {
                this.debugMsg("Invalid Login.");
            }
        },

        handleChatMsg : function(msg) {
            console.log("Chat Mngr: " , ChatManager);
            ChatManager.handleMessage.apply(ChatManager, [msg]);
        },

        handleGameMsg : function(msg) {

        },

        login : function() {
            console.log("Starting login()");
            var _user = this.getDom("loginUser").value;
            var _pass = this.getDom("loginPass").value;

            var LoginObject = {
                user : _user,
                pass : _pass
            }

            this.queue('LOGIN', LoginObject);
            this.setup();
        },

        sendMessage: function(){

            if(this.isConnected()){
                var msg = this.nickname + ": " + this.getDom("chatInput").value;
                ChatManager.sendMessage.apply(ChatManager, [msg]);
            }else{
                this.debugMsg("Error, you must login first.");
            }

        },

        isConnected: function(){
            if(this.socket === null){
                return false;
            }

            return this.socket.socket.connected;
        },

        debugMsg : function(msg) {
            if (this.debug) {
                this.getDom("messages").innerHTML += msg + "<br>";
            }
        },
        updateStatus : function(name, value) {
            var element = document.getElementById(name);
            if (element) {
                element.innerHTML = value;
            }
        }
    };

    return Client;

});