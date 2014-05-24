define(['socketio','underscore'],function(io,_) {

    var Client = {
        debug : true,
        domElements :
            ["messages","loginUser","loginPass",
             "chatInput","chatMessages","chatList"],
        elements: {},
        uID : null,
        socket: null,

        init : function() {
            console.log("Initalized Client");
            _this = this;
            _.map(this.domElements,function( el ){
                _this.elements[el] = document.getElementById(el);
                if(_this.elements[el] === undefined){
                    console.warn("Could not find DOM Element: " + el);
                }
            });

            this.debugMsg("Started Client");
        },

        /**
         * Get the DOM Element instance of the given ID.
         *
         * @param {String} id
         * @returns {DOM Element}
         */
        getDom: function ( id ){
            return this.elements[id];
        },

        setup: function( callback ){
            console.log("Calling setup");
            this.socket = io.connect("http://localhost:8080");

            this.socket.on('message', function(msg, flags) {
                console.log("Client message:" + msg);
                _this.handleMessage(msg, flags);
            });

            this.socket.on('connect', callback);
        },

        handleMessage: function ( msg, flags ) {
            this.debugMsg("Got Message: " + msg);
        },

        login: function (){
            var _user = this.getDom("loginUser").value;
            var _pass = this.getDom("loginPass").value;
            var _this = this;

            console.log("Calling login");
            this.setup(function(){
                var LoginObject = {
                    user: _user,
                    pass: _pass
                }
                console.log("Emit login packet", _this.socket);
                _this.socket.emit('LOGIN', LoginObject);
                _this.socket.send("test","test");
            });
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