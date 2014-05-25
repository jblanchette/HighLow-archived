define(['socketio', 'underscore', 'chatmanager'], function(io, _, ChatManager) {

    var Client = {
        debug : true,
        domElements :
        ["messages", "loginUser", "loginPass",
            "chatInput", "chatMessages", "chatList"],
        elements : {},
        uID : null,
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
            this.socket = io.connect("http://localhost:8080");

            this.socket.on('message', function(msg, flags) {
                console.log("Client message:" + msg);
                _this.handleMessage(msg, flags);
            });

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
        handleMessage : function(msg, flags) {
            this.debugMsg("Got Message: " + msg);
        },
        handleLogin : function(data) {
            this.debugMsg("Got Login Data: " + data.type + " : " + data.id);
            if (data.type === "GOOD") {

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
            switch (msg.type) {
                case "JOIN":
                    ChatManager.joinLobby(msg);
                    break;
            }
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

            console.log("Queue login packet");
            this.queue('LOGIN', LoginObject);
            this.setup();
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