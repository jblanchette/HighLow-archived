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

        login: function (){
            var user = this.getDom("loginUser").value;
            var pass = this.getDom("loginPass").value;

            console.log("User:" + user + " - pass: " + pass);
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