var MessageSender = require("../message/Sender");

function Login( socketID, msg ){
    console.log("Login Message Object: ", socketID);
    console.log("Msg: ", msg);
}

module.exports = Login;