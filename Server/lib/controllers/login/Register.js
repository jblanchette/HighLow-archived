var MessageSender = require("../message/Sender"),
    ClientManager = require("../../managers/ClientManager");

/*
 *  msg {username: String,
 *       email: String,
 *       location: String,
 *       password: String}
 */

function Register(socketID, msg) {

    console.log("Register, socketID:", socketID);
    console.log("msg:", msg);

}

module.exports = Register;