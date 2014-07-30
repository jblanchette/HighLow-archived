var mongoose = require('mongoose'),
    sha1 = require('sha1');

var Schema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        index: {unique: true}
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    validated: Boolean,
    location: String,
    permissions : String,
    rank : Number
});

var sPrefix = 'y3a';
var sSuffix = 'x07';

Schema.methods.comparePassword = function(inputPassword, callback){
    var result = (this.password === sha1(sPrefix + inputPassword + sSuffix));
    callback(null, result);
};

Schema.pre('save', function(next){
    var user = this;
    if (!user.isModified('password')) return next();

    var hash = sha1(sPrefix + user.password + sSuffix);
    user.password = hash;
    console.log("Next password hash:", hash);
    next();
});

var Model = mongoose.model('User', Schema);
module.exports = mongoose.model('User');