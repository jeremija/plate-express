var mongooseConfig = require('../src/mongo/mongoose.js');
var config = require('../src/config.js');
var User = require('../src/mongo/models/user.js');

var promptly = require('promptly');
var async = require('async');

async.series({
    firstName: function(callback) {
        promptly.prompt('first name:', callback);
    },
    lastName: function(callback) {
        promptly.prompt('last name:', callback);
    },
    email: function(callback) {
        promptly.prompt('email:', callback);
    },
    password: function(callback) {
        promptly.password('password:', callback);
    }
}, function(err, userData) {
    if (err) throw err;
    connectAndSave(userData);
});

function connectAndSave(userData) {
    async.series({
        connection: function(callback) {
            connection = mongooseConfig.init(config.mongo.url, callback);
        },
        save: function(callback) {
            var user = new User(userData);
            user.setPassword(userData.password);
            user.enabled = true;
            user.save(callback);
        },
    }, function(err, result) {
        if (err) console.log('error while saving the user', err);
        else console.log('successfully saved the user');
        connection.close(function() {
            process.exit();
        });
    });
}
