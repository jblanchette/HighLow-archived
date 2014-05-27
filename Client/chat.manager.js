define(['underscore', 'chatlobby'], function(_, ChatLobby) {

    var jChatManager = function() {
        this.Client = null;
        this.Lobby = null;
    };

    var jp = jChatManager.prototype;

    jp.setup = function(client) {
        this.Client = client;
    };

    jp.sendMessage = function(msg) {
        var ChatObj = {
                type: "UPDATE",
                NewMessage: msg,
                roomName: this.Lobby.roomName
        };

        console.log("Calling sendMessage", ChatObj);
        this.Client.queue("CHAT", ChatObj);
    };

    jp.handleMessage = function(msg) {
        console.log("Handle Message: ", msg);
        switch (msg.type) {
            case "JOIN":
                this.joinLobby(msg);
                break;
            case "UPDATE":
                this.update(msg);
                break;
        }
    };

    jp.joinLobby = function(msg) {
        console.log("Joining chat lobby!");
        try {
            var obj = JSON.parse(msg.room);
            console.log("Chat Obj: " + obj);
            this.Client.debugMsg("Joined Room: " + JSON.stringify(obj));
            this.Lobby = new ChatLobby(obj);
            this.render();


        } catch (e) {
            console.warn("Error in ChatManager.joinLobby", e);
        }
    };

    jp.update = function(updateObj) {

        console.log("Update obj: ", updateObj);

        if (_.has(updateObj, "NewMember")){
            console.log("Added new member: ", updateObj.NewMember);
            this.Lobby.members.push(updateObj.NewMember);
            this.Lobby.members.sort();
        }

        if(_.has(updateObj, "RemoveMember")){
            console.log("removeing member:" + updateObj.RemoveMember);
            this.Lobby.members = _.without(this.Lobby.members, updateObj.RemoveMember);
        }

        if(_.has(updateObj, "NewMessage")){
            console.log("New Chat Message: ", updateObj.NewMessage);
            this.Lobby.messages.push(updateObj.NewMessage);
        }



        this.render();

    };

    jp.render = function() {
        var listHTML = "<ul>";
        var msgHTML = "<ul>";
        var _this = this;

        if (this.Lobby === null) {
            return;
        }

        console.log("Calilng Chat.render()", this.Lobby);
        this.Client.getDom("chatHeader").innerHTML = "<h4>" + this.Lobby.roomName + "</h4>";


        _.each(this.Lobby.members, function(member) {
            listHTML += "<li>" + member + "</li>";
        });
        listHTML += "</ul>";

        this.Client.getDom("chatList").innerHTML = listHTML;

        _.each(this.Lobby.messages, function(msg) {
            msgHTML += "<li>" + msg + "</li>";
        });
        msgHTML += "</ul>";

        this.Client.getDom("chatMessages").innerHTML = msgHTML;

    };

    return new jChatManager();

});