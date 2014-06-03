define(['underscore'], function(_) {

    /**
     * This Definitions Object is a definition of all the messages sent
     * between Client and Server.  The messages are broken up into
     * three major categories: LOGIN, CHAT, GAME.  There are three
     * managers which handle the messages with handleMessage().
     *
     * By defining where messages belong and what parameters and the type of
     * data they provide
     *
     */
    var jDefinitions = function(){
        this.list = {
          "LOGIN": {
              "LOGIN": {
                  func: 'login'

              },
              "LOGOUT": 'logout',
              "REGISTER": 'register',
              "MANAGE": 'manageUserInfo'
          },

          "CHAT": {
              /* Msg Synopsis:
               *
               * .action: JOIN
               * .owner: (String) nickname
               * .roomID: (Int)
               * .flags: (Object) Room Flags
               *
               */
              "JOIN": {
                  func: 'joinLobby',
                  owner: 'String',  // nickname
                  roomID: 'Int',    // Server given Room ID
                  flags: 'Object'   // Additional flags for chat lobby
              },
              "LEAVE": 'leaveLobby',
              "CREATE": 'createLobby',
              "NEWMSG": 'newMsg',
              "FUNC": 'execFunc'
          },

          "GAME": {

          }
        }
    };

});