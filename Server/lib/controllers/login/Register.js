var MessageSender = require("../message/Sender"),
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

    console.log("Register, socketID:", socketID);


    var _type;
    var _code;

    UserModel.findOne({username: msg.username}, function(err, user){
        if(err){
            // Some kind of mongoose error occured.
            _type = "BAD";
            _code = 3;

            return; // return from the callback, not the Register func
        }

        if(!user){

            UserModel.findOne({email: msg.email}, function(err, euser){
                if(!euser){
                    _type = "GOOD";
                    _code = 1;
                }else{
                    _type = "BAD";
                    _code = 4;
                }
            });

        }else{
            _type = "BAD";
            _code = 2;
        }
    });

    var RegisterObj = {
        type: _type,
        code: _code
    };

    MessageSender.send(socketID, "LOGIN", RegisterObj);

}

module.exports = Register;