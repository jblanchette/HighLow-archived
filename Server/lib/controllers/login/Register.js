var MessageSender = require("../message/Sender"),
    ClientManager = require("../../managers/ClientManager"),
    UserModel = require("../../models/User");

/*
 *  msg {username: String,
 *       email: String,
 *       location: String,
 *       password: String}
 */

function Register(socketID, msg) {

    console.log("Register, socketID:", socketID);

    var RegisterObj = {
        type: "",
        code: 0
    };

    UserModel.findOne({username: msg.username}, function(err, user){
        if(err){
            // Some kind of mongoose error occured.
            RegisterObj.type = "BAD";
            RegisterObj.code = 3;

            return; // return from the callback, not the Register func
        }

        if(!user){
            RegisterObj.type = "GOOD";
            RegisterObj.code = 1;
        }else{
            RegisterObj.type = "BAD";
            RegisterObj.code = 2;
        }
    });

    MessageSender.send(socketID, "LOGIN", RegisterObj);

}

module.exports = Register;