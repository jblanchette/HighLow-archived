var mongoose = require('mongoose');

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
    permissions : String,
    rank : Number
});

Schema.pre('save', function(next){
    var user = this;
    if (!user.isModified('password')) return next();

    var hash = sha1('y3a' + user.password + 'x07');
    user.password = hash;
    console.log("Next password hash:", hash);
    next();
});

var Model = mongoose.model('User', Schema);
module.exports = mongoose.model('User');