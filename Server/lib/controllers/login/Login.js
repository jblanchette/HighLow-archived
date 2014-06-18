var MessageSender = require("../message/Sender"),
    ClientManager = require("../../managers/ClientManager");

function Login( socketID, msg ){


    var ResponseObj = {
        action: "Login",
        type: "GOOD"
    };
    console.log("Got Login: ", msg);
    var nClient = ClientManager.get( socketID );
    if(nClient !== undefined){
        nClient.authorize();
        console.log("Calling Send ***");
        MessageSender.send( socketID, "LOGIN", ResponseObj);
    }else{
        console.log("*** ERROR *** Could not find client with socketID: ", socketID);
    }

}

module.exports = Login;