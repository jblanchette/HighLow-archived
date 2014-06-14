define(['require', 'socketio', 'underscore', 'chatmanager', 'jquery'],
function(require, io, _, ChatManager, $) {

    var Client = {
        debug : true,
        domElements :
        ["messages", "loginUser", "loginPass",
            "chatInput", "chatMessages", "chatList",
            "chatHeader", "lobbyHolder",
            "adminControls"],
        elements : {},
        nickname : "",
        isAdmin : false,
        emitQueue : [],
        outgoingDef: {},
        socket : null,
        events : {
            'LOGIN' : 'handleLogin',
            'CHAT' : 'handleChatMsg',
            'GAME' : 'handleGameMsg'
        },

        test: {
            'A': ChatManager.handleMessage
        },

        setupDebug: function(){
            var _this = this;
            this.outgoingDef = {
                "LOGIN" : {
                    "Login": ['user','pass'],
                    "Logout": ['user']
                },
                "CHAT" : {
                    "Join":   ['roomID'],
                    "Leave":  ['roomID'],
                    "Make":   ['roomOptions'],
                    "NewMsg": ['roomID', 'data (Object [timestamp, authorID, message)'],
                    "Func":   ['funcID', 'funcData']
                }
            };

            var out = "<div id='d_actionHolder'>";
            out += "Actions:<br><select id='d_emitName'>";

            var defValues = _.values(this.outgoingDef);

            var actionObj = {};

            _.each(this.outgoingDef, function(emitObj, emitName){
                out += "<option value='0'>----" + emitName + "</option>";
                _.each(_.keys(emitObj), function (action){
                    out += "<option value='" + emitName +"'>" + action + "</option>";
                });
            });
            out += "</select><br> </div>";


            _.each(defValues, function (emitObj){

                _.each(emitObj, function( emitList, action){
                    out += "<div id='d_name_" + action + "' class='emitNameHolder'>";

                    out += emitList.join();

                    out += "</div>";

                });

            });

            $("#debugHolder").html(out);

            var _this = this;

            $("#d_emitName").change(function(){
                var obj = $(this).children(':selected');
                var emitAction = obj.text();
                $('.emitNameHolder').hide();
                $('#d_name_' + emitAction).show();

                $('#debugEmitName').val(obj.val());
                $('#debugText').val('{\n action: "' + emitAction + '",\n \n}');
            });
        },

        init : function() {
            console.log("Initalized Client");
            this.setupDebug();
            _this = this;
            _.map(this.domElements, function(el) {
                _this.elements[el] = document.getElementById(el);
                if (_this.elements[el] === undefined) {
                    console.warn("Could not find DOM Element: " + el);
                }
            });

            ChatManager.setup(this);

            this.debugMsg("Started Client");

            this.getDom("loginUser").value = "User#" + Math.floor((Math.random() * 10000) + 1);

            this.setupDom();

        },

        setupDom: function() {

            var login = $("#button_login");
            login.click(function() {
                Client.login();
            });

            /*var send = getEl("button_sendChat");
             send.addEventListener("click", function(){
             Client.sendMessage();
             });*/

            $('#button_kickUser').click(function() {
                console.log("Kicking user: ", $("#adminInput").val());
                Client.adminFunc("kick", adminInput.value);
            });

            $('#button_makeChat').click(function(){
                console.log("Making chat");
                Client.makeChat($("#makeChat_name").val());
            });

            $('#button_refreshList').click(function(){
                Client.refreshList();
            });

            $('#debugButton').click(function(){
                Client.sendDebug();
            });


        },

        sendDebug: function(){
            var emitName = $('#debugEmitName').val();
            var emitVal = $('#debugText').val();
            var emitObj = eval('(' + emitVal + ')');
            console.log("sending ", emitName, emitObj);
            this.queue(emitName, emitObj);
        },

        refreshList: function(){
            var ChatObj = {
                type: "UPDATE",
                action: "RefreshList"
            };

            this.queue("CHAT",ChatObj);
        },

        makeChat: function( name ){
            console.log("Making chat: ", name);
            var ChatObj = {
                type: "CREATE",
                roomName: name
            };

            this.queue("CHAT",ChatObj);
        },

        adminFunc : function(name, data) {
            switch (name) {
                case "kick":
                    var KickObj = {
                        type : "UPDATE",
                        roomName : ChatManager.Lobby.name,
                        RemoveMember : data
                    };
                    this.queue("CHAT", KickObj);
                    break;
            }
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

            _.each(Client.events, function(fn, name) {
                _this.socket.on(name, function(data) {
                    Client[fn].apply(_this, [data]);
                })
            });

            this.socket.on('connect', Client.onConnect.bind(this));

            this.socket.on('disconnect', function() {
                console.log(_this.socket.socket);
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
        onDisconnect : function(socket) {
            console.log("Server disconnected!", socket);
            io.disconnect();
            this.socket = null;
            this.clearQueue();
        },
        onConnect : function() {
            console.log("onConnect called");
            Client.runQueue();
        },
        handleLogin : function(data) {
            console.log("*** Handle Login:", data);
            if (data.type === "GOOD") {
                this.updateStatus("connected", "True");
                this.updateStatus("logged_in", "True");
                this.nickname = data.nickname;

                if (data.admin) {
                    this.isAdmin = true;
                    this.getDom("adminControls").style.display = "block";
                    this.debugMsg("** User granted Admin rights.");
                }

                this.debugMsg("Asking server to join chat.");

                var ChatObject = {
                    action : "Join",
                    roomID : "ANY"
                };

                this.socket.emit("CHAT", ChatObject);
            } else {
                this.debugMsg("Invalid Login.");
            }
        },
        handleChatMsg : function(msg) {
            console.log("Chat Mngr: ", ChatManager);
            ChatManager.handleMessage.apply(ChatManager, [msg]);
        },
        handleGameMsg : function(msg) {

        },
        login : function() {
            console.log("Starting login()");
            var _user = this.getDom("loginUser").value;
            var _pass = this.getDom("loginPass").value;

            var LoginObject = {
                action: "Login",
                user : _user,
                pass : _pass
            }

            this.getDom("loginUser").value = "";
            this.getDom("loginPass").value = "";

            if (this.socket === null || !this.socket.socket.connected) {
                this.clearMsg();
                this.clearQueue();
                this.queue('LOGIN', LoginObject);
                this.setup();
            } else {
                console.log("NO LOGIN, already conn");
            }
        },
        sendMessage : function(chatID, chatMsg) {
            console.log("Tryign to send to " + chatID + " msg: " + chatMsg);
            if (this.isConnected()) {

                var chatEl = document.getElementById(chatID);
                if (chatEl === undefined) {
                    console.warn("Could not find Chat Lobby: " + chatID);
                    return;
                }
                var msg = this.nickname + ": " + chatMsg;
                console.log("***Client sending msg to " + chatID + ": " + msg);
                ChatManager.sendMessage.apply(ChatManager, [chatID, msg]);
            } else {
                this.debugMsg("Error, you must login first.");
            }

        },
        isConnected : function() {
            if (this.socket === null) {
                return false;
            }

            return this.socket.socket.connected;
        },
        clearMsg : function() {
            this.getDom("messages").innerHTML = "<h3>Messages</h3>";
        },
        addChatLobby : function(Lobby) {

            var holder = this.getDom("lobbyHolder");

            console.log("**** Lobby Test: " + Lobby);

            var newEl = document.createElement("div");
            var chatID = "chatLobby" + (holder.children.length + 1);

            var html = '<div id="' + chatID + '" style="display: none;">' +
            '<div id="' + chatID + '_header" class="chatHeader"><h4>Lobby</h4></div>' +
            '<div id="' + chatID + '_messages" class="chatMessages"></div>' +
            '<div id="' + chatID + '_list" class="chatList"></div>' +
            '<div class="chatInputHolder">' +
            '<input type="text" value="Enter Message..."' +
            'onclick="this.value=\'\'" id="' + chatID + '_input" class="chatInput">' +
            '<input type="button" value="Send"' +
            'id="' + chatID + '_sendChat" class="sendChat">' +
            '</div>' +
            '</div>';

            newEl.innerHTML = html;

            holder.appendChild(newEl);


            var send = $('#' + chatID + '_sendChat');

            send.click(function() {
                var chatInput = $('#' + chatID + '_input').val();
                Client.sendMessage(chatID, chatInput);
            });

            var tabEl = document.createElement("li");
            tabEl.innerHTML = Lobby.roomName;
            tabEl.id = chatID + '_tab';

            tabEl.addEventListener("click", function() {
                Client.selectLobby(chatID);
            });

            $('#lobbyTabs ul').append(tabEl);

            return chatID;
        },

        selectLobby: function(chatID) {
            var lobbyEl = $('#' + chatID);
            var oldLobby = ChatManager.selectedLobby;
            if (lobbyEl !== undefined) {

                if (oldLobby !== "" && oldLobby !== chatID) {
                    $('#' + oldLobby + '_tab').css('background-color', '#FFFFFF');
                }

                // assign selected, hightlight tab
                // @TODO: When we split the UI I might need to remake this into
                //        a simple get/set function for the selected. But
                //        it should just be a String for the chatID so idk.
                ChatManager.selectedLobby = chatID;
                $('#' + oldLobby).hide();
                $('#' + chatID + '_tab').css('background-color', '#E0E0E0');
                lobbyEl.show();

            }
        },
        debugMsg : function(msg) {
            this.getDom("messages").innerHTML += msg + "<br>";
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