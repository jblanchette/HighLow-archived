var MessageSender = require("../message/Sender");

function Login( msg ){
    console.log("Login Message Object: ", msg);
    console.log(MessageSender);
}

module.exports = Login;