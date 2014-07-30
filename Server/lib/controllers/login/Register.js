var _ = require("underscore"),
    MessageSender = require("../message/Sender"),
    ClientManager = require("../../managers/ClientManager"),
    UserModel = require("../../models/User");

/*
 *  msg {username: String,
 *       email: String,
 *       location: String,
 *       password: String}
 */

/*
 * codes:
 *  1- all good
 *  2- username isn't unique
 *  3- some kind of mongoose error
 *  4- email isn't unique
 */

function Register(socketID, msg) {
    console.log("Running Register.");

    var NewUser = {
        username: msg.username,
        password: msg.password,
        email: msg.email,
        location: msg.location,
        rank: 1,
        permissions: 'Default'
    };

    UserModel.create(NewUser, function(err, user){
        var _code, _type, _msg;

        if(err){
            console.log("Register Error: Error creating user.");

            for(e in err){
                console.log("Error: ", err[e]);
            }

            _type = "BAD";
            _code = 2;

        }else{
            console.log("Registered new user:", user);
            _type = "GOOD";
            _code = 1;
            _msg = "Success.";
        }

        var RegisterObj = {
            action: "Register",
            type: _type,
            code: _code,
            msg: _msg
        }

        console.log("Sending packet to client:", RegisterObj);
        MessageSender.emit(socketID, "LOGIN", RegisterObj);
    });

}

module.exports = Register;