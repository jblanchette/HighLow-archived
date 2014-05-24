    var pg = require("pg"),
    _ = require("underscore");
    var pgConnectionString = "pg://postgres:hello1@localhost/postgres";

    var jLoginManager = function() {
        this.uIDList = [];
    };

    jLoginManager.prototype.login = function( socket, msg) {

        var loginResult;

        var loginObject = {
                    username: msg.user,
                    password: msg.pass
        };

        pg.connect(pgConnectionString, function(err, client, done) {
            client.query('SELECT * FROM users', function(err, result) {

                if (err) {
                    return console.log("PG Error in login", err);
                }

                loginResult = _.findWhere(result.rows, loginObject);

                if (loginResult !== undefined) {
                    console.log("Valid Login!");

                    socket.send("Valid Login!");
                } else {
                    socket.send("Invalid Login!");
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
