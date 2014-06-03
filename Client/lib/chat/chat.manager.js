define(['underscore', 'chatlobby', 'msgdef', jquery'], function(_, ChatLobby, MsgDef, $) {

    var jChatManager = function() {

        this.actions = MsgDef["CHAT"];
        this.Client = null;
        this.Lobbies = {};
        this.ServerLobbies = {};
        this.selectedLobby = "";
    };

    var jp = jChatManager.prototype;

    jp.handleMessage = function(msg){
        var _this = this;
        if(_.has(this.actions,msg.action)){
            this.actions[msg.action].call(_this, msg);
        }
    };

    jp.joinLobby = function( msg ){
        console.log("ChatManager.joinLobby");

        /* Msg Synopsis:
         *
         * .action: JOIN
         * .owner: (String) nickname
         * .roomID: (Int)
         * .flags: (Object) Room Flags
         *
         */
    };

    jp.createLobby = function( msg ){
        console.log("ChatManager.createLobby");

        // @NOTE: Very similar to JOIN action.  Split up for UI purposes
        // but could be cut out and just have some error checking
        // in the "join" local lobby creation.

        /* Msg Synopsis:
         *
         * .action: CREATE
         * .owner: (String) nickname
         * .roomID: (Int)
         * .flags: (Object) Room Flags
         *
         */

    };

    jp.leaveLobby = function( msg ){
        console.log("ChatManager.leaveLobby");

        /* Msg Synopsis:
         *
         * .action: LEAVE
         * .roomID: (Int)
         *
         * Optional:
         * .leaverID: (ClientUID) Unique local ID
         *
         * - Without optional param, the local client is the person leaving.
         */
    };

    jp.execFunc = function( msg ){
        console.log("ChatManager.execFunc");

        // @NOTE: Intended use is for this to run lobby specific functions,
        // But this is still up in the air completely.

        // Some example functions passed would be "kick", "ban", "change topic",
        // and other minor things that might just get passed to the lobby
        // instance or something instead.

        /* Msg Synopsis:
         *
         * .action: FUNC
         * .name: (String) Name of the function to be executed
         * .args: (Array) Arguments passed via apply() to the function
         *
         */
    };

    return new jChatManager();

});