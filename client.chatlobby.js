define(['underscore'], function(_) {
    var jChatLobby = function(roomName, owner) {

        if (arguments.length === 0) {
            this.roomName = "Room #" + Math.floor((Math.random() * 10000) + 1);
            this.owner = -1;
        } else {
            this.roomName = roomName;
            this.owner = owner;
        }

        this.members = [];

    };

    var jc = jChatLobby.prototype;

    jc.isFull = function() {
        return !(this.members.length < 249);
    };

    jc.addMember = function(name) {
        this.members.push(name);
    };

    jc.removeMember = function(name) {
        this.members = _.without(this.members, name);
    };

    return jChatLobby;
});