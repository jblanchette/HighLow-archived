var MessageSender = require("../message/Sender"),
    ClientManager = require("../../managers/ClientManager"),
    UserModel = require("../../models/User");

/*
 *  msg {username: String,
 *       password: String}
 */

function Login(socketID, msg) {

    var ResponseObj = {
        action : "Login",
        type : ""
    };

    // findOne model from the collection which matches the username,
    // test against the password using the defined 'comparePassword'
    // method we added to the user model schema.
    
    UserModel.findOne({username: msg.username}, function(err, user) {
        console.log("Found user, doing compPass.");
        if (user) {
            user.comparePassword(msg.password, function(err, isMatch) {
                if(isMatch){
                    ResponseObj.type = "GOOD";
                }else{
                    ResponseObj.type = "BAD";
                }
            });
        } else {
            console.log("No user found");
        }
    });

    // We need a valid entry in the ClientManager from when
    // the connection was first established.  This is because
    // after the login, we call the "authorize" method on
    // the client instance.

    var nClient = ClientManager.get(socketID);
    if (nClient !== undefined) {
        MessageSender.send(socketID, "LOGIN", ResponseObj);

        if(ResponseObj.type === "GOOD"){
            nClient.authorize();
        }

    } else {
        console.log("*** ERROR *** Could not find client with socketID: ", socketID);
    }

}

module.exports = Login;