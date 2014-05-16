var jLoginManager = function() {
    this.uIDList = [];
};

jLoginManager.prototype.create = function ( returnSocket ){
    var tempID = "UID" + Math.floor((Math.random() * 999999) + 1);

    while(this.uIDList[tempID] !== undefined){
        tempID = "UID" + Math.floor((Math.random() * 999999) + 1);
    }

    this.uIDList[tempID] = returnSocket;

    console.log("Created UID: ", tempID);
    return tempID;
};

jLoginManager.prototype.get = function ( uID ){
    return this.uIDList[uID];
};

jLoginManager.prototype.remove = function ( uID ){
    delete this.uIDList[uID];
};

exports.LoginManager = new jLoginManager();