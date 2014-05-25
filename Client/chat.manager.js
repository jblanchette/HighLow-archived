define(['underscore', 'chatlobby'], function(_, ChatLobby) {

    var jChatManager = function() {
        this.Client = null;
        this.Lobby = null;
    };

    var jp = jChatManager.prototype;

    jp.setup = function(client) {
        this.Client = client;
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

        console.log("UPdate obj: ", updateObj);

        if (_.has(updateObj, "NewMember")) {
            console.log("Added new member: ", updateObj.NewMember);
            this.Lobby.members.push(updateObj.NewMember);
            this.Lobby.members.sort();
            this.Lobby.members = _.uniq(this.Lobby.members, true);
        }

        this.render();

    };

    jp.render = function() {
        var listHTML = "<ul>";
        var _this = this;

        if (this.Lobby === null) {
            return;
        }

        console.log("Calilng Chat.render()", this.Lobby);
        this.Client.getDom("chatHeader").innerHTML = "<h4>" + this.Lobby.roomName + "</h4>";


        _.each(this.Lobby.members, function(i) {
            listHTML += "<li>" + i + "</li>";
        });
        listHTML += "</ul>";

        this.Client.getDom("chatList").innerHTML = listHTML;
    };

    return new jChatManager();

});