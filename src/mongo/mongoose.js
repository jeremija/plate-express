var mongoose = require('mongoose');
var log = require('../log/log.js').getLog(__filename);

module.exports.create = function(p_url, p_callback) {
    //var conn = mongoose.createConnection(p_url);
    mongoose.connect(p_url);
    var conn = mongoose.connection;

    conn.on('error', function(err) {
        log.error('error while creating connection', p_url,
            err);
        p_callback(err);
    });

    conn.once('open', function() {
        p_callback(undefined, conn);
    });
};