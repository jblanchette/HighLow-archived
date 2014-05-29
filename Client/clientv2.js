define(['socketio', 'underscore', 'loginmanager', 'chatmanager', 'gamemanager', 'jquery'],
    function(io, _, LoginManager, ChatManager, GameManager, $) {

    var Client = {

        // @TODO: Don't call it a list? Since it's an object? Or idk...
        emitList: {
            "LOGIN": LoginManager.handleMessage,
            "CHAT":  ChatManager.handleMesssage,
            "GAME":  GameManager.handleMessage
        },

        init: function(){
            this.io = io;
            this.socket = null;
            this.emitQueue = [];
        },

        // @TODO: This should be in the LoginManager
        login : function(_user, _pass) {

            var LoginObject = {
                user : _user,
                pass : _pass
            }

            if (!this.isConnected()) {
                this.clearMsg();
                this.clearQueue();
                this.queue('LOGIN', LoginObject);
                this.setup();
            }

        },


        /**
         * Setup the socket.io connection to the server.
         * Dispatch the handlers for emit messages from the emitList.
         *
         * When an emit message is recieved, it is sent to the handler
         * function based on the key in the emitList object.
         *
         * @returns {undefined}
         */
        setupConnection: function(){
            try {
                this.socket = this.io.connect("http://localhost:8080");
            } catch (e) {
                console.warn("Error trying to connect to Server: ", e);
                return;
            }

            _.each(Client.emitList, function( emitFunc, emitKey ) {
                Client.socket.on(emitKey, function( msg ) {
                    emitFunc.call(_this, msg);
                });
            });
        },

        /**
         * Hard clear the emitQueue
         */
        clearQueue : function() {
            this.emitQueue = [];
        },

        /**
         * Put a message object into the emit queue.
         *
         * If the socket is connected, run the queue in FIFO order.
         *
         * @param {String} emitName
         * @param {Object} emitObj
         */
        queue : function(emitName, emitObj) {

            this.emitQueue.push({
                emitKey: emitName,
                emitObj: emitObj
            });


            if (this.isConnected()) {
                this.runQueue();
            }
        },

        /**
         * Loop through each message in the emitQueue and try to emit it.
         */
        runQueue : function() {
            if (!this.isConnected()) {
                console.warn("Tried to run queue without being connected.");
                return false;
            }

            _.each(this.emitQueue, function( msg ) {
                console.log("Sending message in queue", msg);
                try {
                    Client.socket.emit(msg.emitKey, msg.emitObj);
                    // Remove this msg from the queue
                    this.emitQueue.splice(0,1);
                } catch(e) {
                    console.warn("Problem sending queue msg: ", e);
                    console.warm("Queue Msg: ", msg);
                }
            });
        },

        isConnected: function(){

        },

        onConnect: function(){
            Client.runQueue();
        },

        onDisconnect: function(){
            // @TODO: Figure out weirdness with socket.io heartbeat
            //        Maybe have to roll back to different socket.io version?
        }
    };

    return Client;
});