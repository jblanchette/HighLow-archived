define(['underscore', 'chatlobby', 'jquery'], function(_, ChatLobby, $) {

    var jChatManager = function() {
        this.Client = null;
        this.Lobbies = {};
        this.ServerLobbies = {};
        this.selectedLobby = "";
    };

    var jp = jChatManager.prototype;

    jp.setup = function(client) {
        this.Client = client;
    };

    jp.sendMessage = function( cID, msg) {

        var Lobby = _.findWhere( this.Lobbies, {chatID: cID});
        console.log(this.Lobbies);
        console.log("*** Sending to Lobby: ", Lobby);
        var ChatObj = {
                type: "UPDATE",
                NewMessage: msg,
                roomID: Lobby.id,
                roomName: Lobby.roomName
        };

        this.Client.queue("CHAT", ChatObj);
    };

    jp.handleMessage = function(msg) {
        console.log("ChatMngr handleMessage: ", msg);
        console.log("msg.type === " + msg.type + " test : " + (msg.type === "UPDATE"));
        switch (msg.type) {
            case "JOIN":
                this.joinLobby(msg);
                break;
            case "UPDATE":
                console.log("Calling this.update with msg");
                this.update(msg);
                break;
        }
    };

    jp.joinLobby = function(msg) {
        console.log("Joining chat lobby!");
        /*try {*/
            var obj = JSON.parse(msg.room);

            console.log("Chat Obj: " + obj);
            this.Client.debugMsg("Joined Room: " + JSON.stringify(obj));
            this.Client.updateStatus("room_name", obj.roomName);


            var chatID = this.Client.addChatLobby( obj );

            this.Lobbies[obj.id] =
                new ChatLobby(chatID, obj);

            this.render();

            if(this.selectedLobby === ""){
                this.Client.selectLobby(chatID);
            }

       /* } catch (e) {
            console.warn("Error in ChatManager.joinLobby", e);
        }*/
    };

    jp.update = function(updateObj) {
        console.log("Calling update() ", updateObj);
        if (_.has(updateObj, "NewMember")){
            console.log("Added new member: ", updateObj.NewMember);
            this.Lobbies[updateObj.roomID].members.push(updateObj.NewMember);
            this.Lobbies[updateObj.roomID].members.sort();
        }

        if(_.has(updateObj, "RemoveMember")){
            console.log("removeing member:" + updateObj.RemoveMember);
            this.Lobbies[updateObj.roomID].members =
            _.without(this.Lobbies[updateObj.roomID].members,
                      updateObj.RemoveMember);
        }

        if(_.has(updateObj, "NewMessage")){
            console.log("New Chat Message: ", updateObj.NewMessage);
            this.Lobbies[updateObj.roomID].messages.push(updateObj.NewMessage);
        }

        if(_.has(updateObj, "action")){
            switch(updateObj.action){
                case "RefreshList":
                    console.log("*********Updated Rooms");
                    this.ServerLobbies = updateObj.rooms;
                    break;
            }
        }



        this.render();

    };

    jp.render = function() {
        var listHTML;
        var msgHTML;
        var _this = this;

        if (_.keys(this.Lobbies).length === 0) {
            return;
        }

        console.log("Calilng Chat.render()", this.Lobbies);

        var localLobby;
        var joinList = document.getElementById('joinChat_list');
        var joinEl;

        joinList.innerHTML = "";
        this.ServerLobbies = this.ServerLobbies.sort();
        _.each(this.ServerLobbies, function(Lobby){
            joinEl = document.createElement("option");
            joinEl.value = Lobby.id;
            joinEl.innerHTML = Lobby.roomName;
            joinList.appendChild(joinEl);
        });


        _.each(this.Lobbies, function(Lobby) {
            console.log("Rendering ", Lobby);

            listHTML = "<ul>";
            msgHTML = "<ul>";

            localLobby = _this.Lobbies[Lobby.id];
            console.log("Local lobby: ", localLobby);

            $('#' + localLobby.chatID + "_header").html("<h4>" + Lobby.roomName + "</h4>");

            _.each(Lobby.members, function(member) {
                listHTML += "<li>" + member + "</li>";
            });

            listHTML += "</ul>";

            $('#' + localLobby.chatID + "_list").html(listHTML);

            _.each(Lobby.messages, function(msg) {
                msgHTML += "<li>" + msg + "</li>";
            });

            msgHTML += "</ul>";

            console.log("Message html: ", msgHTML);
            console.log("Test: ", $(localLobby.chatID + "_messages"));
            $('#' + localLobby.chatID + "_messages").html(msgHTML);

        });

    };

    return new jChatManager();

});