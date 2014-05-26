var pg = require("pg"),
_ = require("underscore");
var pgConnectionString = "pg://postgres:hello1@localhost/postgres";

var _Server = require("./server");

/**
 * The LoginManager should validate and store the information for each client.
 *
 * Each client should have:
 *  - socketID from socket.io generation
 *  - nickname from registered user database
 *  - chatRoomList list of chat room names (@TODO: replace with ID's)
 *  - @TODO: some game information
 * @returns {jLoginManager}
 */
var jLoginManager = function() {
    this.IDList = {};
    this.Server = null;
};

var jp = jLoginManager.prototype;

jp.setup = function ( server ){
    this.Server = server;
};

jp.handleMessage = function(socket, msg) {
    console.log("Got login message", msg);
    this.login(socket, msg);
};

jp.getNickname = function ( id ){
    return this.IDList[ id ];
};

jp.login = function(socket, msg) {

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

jp.create = function(returnSocket) {
    var tempID = "UID" + Math.floor((Math.random() * 999999) + 1);

    while (this.uIDList[tempID] !== undefined) {
        tempID = "UID" + Math.floor((Math.random() * 999999) + 1);
    }

    this.uIDList[tempID] = returnSocket;

    console.log("Created UID: ", tempID);
    return tempID;
};

jp.get = function(uID) {
    return this.uIDList[uID];
};

jp.remove = function(uID) {
    delete this.uIDList[uID];
};

exports.LoginManager = new jLoginManager();
