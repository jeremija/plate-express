var config = require('./config.js');
var log = require('./log/log.js').getLog(__filename);
var mongooseConfig = require('./mongo/mongoose.js');

var app = require('./app.js');

var server;
var dbConn;

module.exports = {
    start: function(p_callback) {
        log.debug('application starting');

        //create a mongodb connection and start application
        dbConn = mongooseConfig.init(config.mongo.url, function(err, conn) {
            if (!p_callback && err) throw err;
            if (err) {
                p_callback(err);
                return;
            }

            server = app.init(process.env.port || config.express.port);
            //success
            log.debug('application started');
            if (p_callback) {
                p_callback();
            }
        });
    },
    stop: function(p_callback) {
        log.debug('attempting to stop application');

        try {
            server.close();
            dbConn.once('close', function() {
                log.debug('application stopped');
                if (p_callback) {
                    //success
                    p_callback();
                }
            });
            dbConn.close();
        }
        catch(err) {
            if (!p_callback) throw err;
            p_callback(err);
        }
    }
};