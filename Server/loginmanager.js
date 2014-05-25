var pg = require("pg"),
_ = require("underscore");
var pgConnectionString = "pg://postgres:hello1@localhost/postgres";

var jLoginManager = function() {
    this.IDList = {};
};

jLoginManager.prototype.handleMessage = function(socket, msg) {
    console.log("Got login message", msg);
    this.login(socket, msg);
};

jLoginManager.prototype.getNickname = function ( id ){
    return this.IDList[ id ];
};

jLoginManager.prototype.login = function(socket, msg) {

    var loginResult;
    var _this = this;
    var loginObject = {
        username : msg.user,
        password : msg.pass
    };

    pg.connect(pgConnectionString, function(err, client, done) {
        client.query('SELECT * FROM users', function(err, result) {

            if (err) {
                return console.log("PG Error in login", err);
            }

            loginResult = _.findWhere(result.rows, loginObject);

            if (1) {
                socket.send("Valid Login! " + socket.id);
                socket.emit('LOGIN', {type : "GOOD", id : socket.id, nickname: loginObject.username});

                // Save a copy of the socket ID as the key to the nickname
                _this.IDList[socket.id] = loginObject.username;
            } else {
                socket.send("Invalid Login!");
                socket.emit('LOGIN', {type : "BAD"});
            }

            done();
        });
    });
}

jLoginManager.prototype.create = function(returnSocket) {
    var tempID = "UID" + Math.floor((Math.random() * 999999) + 1);

    while (this.uIDList[tempID] !== undefined) {
        tempID = "UID" + Math.floor((Math.random() * 999999) + 1);
    }

    this.uIDList[tempID] = returnSocket;

    console.log("Created UID: ", tempID);
    return tempID;
};

jLoginManager.prototype.get = function(uID) {
    return this.uIDList[uID];
};

jLoginManager.prototype.remove = function(uID) {
    delete this.uIDList[uID];
};

exports.LoginManager = new jLoginManager();
