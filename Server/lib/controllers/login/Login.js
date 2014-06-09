var MessageSender = require("../message/Sender");

function Login( socketID, msg ){
    console.log("socketID: ", socketID);
    console.log("Msg: ", msg);
}

module.exports = Login;