var MessageSender = require("../message/Sender"),
    ClientManager = require("../../managers/ClientManager");

function Join( socketID, msg ){

    console.log("Having " + socketID + " join! ", msg);

}

module.exports = Join;