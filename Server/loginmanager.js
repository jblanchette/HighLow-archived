// var pg = require("pg");

var _ = require("underscore");
var pgConnectionString = "pg://postgres:hello1@localhost/postgres";

var Client = require("./server.client").Client;


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
    this.Server = null;
    this.ClientList = {};
};

var jp = jLoginManager.prototype;

jp.setup = function ( server ){
    this.Server = server;
};

jp.handleMessage = function(socket, msg) {
    console.log("Got login message", msg);
    this.login(socket, msg);
};

jp.login = function(socket, msg) {

    var loginObject = {
        username : msg.user,
        password : msg.pass
    };

    /*pg.connect(pgConnectionString, function(err, client, done) {
        client.query('SELECT * FROM users', function(err, result) {

            if (err) {
                return console.log("PG Error in login", err);
            }


            loginResult = _.findWhere(result.rows, loginObject);

            */

           // @TODO: Took out database for now
           // always login no matter what, use the username passed.
            if (1) {
                socket.send("Valid Login! " + socket.id);
                socket.emit('LOGIN', {type : "GOOD", id : socket.id, nickname: loginObject.username});

                // Save a copy of the socket ID as the key to the nickname
                this.addClient(socket.id, loginObject.username);
            } else {
                socket.send("Invalid Login!");
                socket.emit('LOGIN', {type : "BAD"});
            }

            //done();
        //});
    //});
}

jp.addClient = function( socketID, nickname ) {
    var nClient = new Client( socketID, nickname );
    console.log("Adding new Client: ", nClient);

    if(_.has(this.ClientList, socketID)){
        console.log("***** Replaced existing client?");
    }

    this.ClientList[socketID] = nClient;

};

jp.get = function( socketID ) {
    console.log("Running LM.get ", socketID);
    return this.ClientList[socketID];
};

jp.remove = function( socketID ) {
    delete this.ClientList[socketID];
};

exports.LoginManager = new jLoginManager();
