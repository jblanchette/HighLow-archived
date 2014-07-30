var _ = require("underscore");
var UserModel = require("../models/User");

var jAdmin = function(input) {

    // get rid of line break at end of input
    input = input.replace(/\r\n$/g, "");

    var arr = input.split(" ");

    // first arg is command
    var cmd = arr.shift();
    var args = [];

    if (arr.length > 0) {
        args = arr;
    }

    switch (cmd) {
        case "help":
            console.log("Command Syntax: [command] ([argument1] [argument2] [...])");
            console.log("Available Commands:");
            console.log(" - listusers, deleteall");
            break;
        case "listusers":
            UserModel.find({}, function(err, users) {
                if (err) {
                    console.log("Error:", err);
                }

                if (!users.length) {
                    console.log("No users found.");
                }

                _.each(users, function(user) {
                    console.log(user + "\n");
                });
            });
            break;
        case "deleteall":
            var query;
            UserModel.find({}, function(err, users) {
                if (err) {
                    console.log("Error:", err);
                }

                _.each(users, function(user) {
                    query = UserModel.remove({_id : user._id});
                    query.exec();
                    console.log("Removed user:", user.username);
                });
            });
            break;

        default:
            console.log("No Command Found.");
            break;

    }

};

module.exports = jAdmin;