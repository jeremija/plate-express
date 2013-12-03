var mongoose = require('mongoose');
var log = require('../log/log.js').getLog(__filename);
var config = require('../config.js');

mongoose.set('debug', config.mongo.debug);

module.exports.init = function(p_url, p_callback) {
    // var conn = mongoose.createConnection(p_url);
    mongoose.connect(p_url);
    var conn = mongoose.connection;

    conn.on('error', function(err) {
        p_callback(err);
    });

    conn.once('open', function() {
        p_callback(undefined, conn);
    });

    return conn;
};