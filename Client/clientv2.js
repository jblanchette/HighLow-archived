define(['socketio', 'underscore', 'loginmanager', 'chatmanager', 'gamemanager', 'jquery'],
    function(io, _, LoginManager, ChatManager, GameManager, $) {

    var Client = {

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

        login : function(_user, _pass) {

            var LoginObject = {
                user : _user,
                pass : _pass
            }

            if (this.socket === null || !this.socket.socket.connected) {
                this.clearMsg();
                this.clearQueue();
                this.queue('LOGIN', LoginObject);
                this.setup();
            }

        },

        setup: function(){

            var _this = this;

            this.socket = this.io.connect("http://localhost:8080");

            _.each(Client.emitList, function( emitFunc, emitKey ) {
                _this.socket.on(emitKey, function( msg ) {
                    emitFunc.call(_this, msg);
                });
            });
        },

        clearQueue : function() {
            this.emitQueue = [];
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

        onConnect: function(){

        },

        onDisconnect: function(){

        }
    };

    return Client;
});