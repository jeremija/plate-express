var config = require('./config.js');
var log = require('./log/log.js').getLog(__filename);
var mongooseConfig = require('./mongo/mongoose.js');

var fs = require('fs');
var http = require('http');
var https = require('https');

var app = require('./app.js');

var httpServer;
var httpsServer;
var dbConn;

module.exports = {
    _startHttp: function(expressApp, port) {
        httpServer = http.createServer(expressApp);
        httpServer.listen(port);
        log.debug('started http server on port ' + port);
    },
    _startHttps: function(expressApp, port) {
        var privateKey = fs.readFileSync(
            __dirname + '/../ssl/' + config.express.cert + '.key', 'utf8');
        var certificate = fs.readFileSync(
            __dirname + '/../ssl/' + config.express.cert + '.crt', 'utf8');
        var credentials = {
            key: privateKey,
            cert: certificate
        };

        httpServer = https.createServer(credentials, expressApp);
        httpServer.listen(port);
        log.debug('started https server on port ' + port);
    },
    start: function(p_callback) {
        log.debug('application starting');
        var self = this;

        //create a mongodb connection and start application
        dbConn = mongooseConfig.init(config.mongo.url, function(err, conn) {
            if (!p_callback && err) throw err;
            if (err) {
                p_callback(err);
                return;
            }

            var expressApp = app.init();

            // process.env.port || config.express.port
            if (config.express.http) {
                self._startHttp(expressApp, config.express.port);
            }
            if (config.express.https) {
                self._startHttps(expressApp, config.express.securePort);
            }

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
            if (httpServer) httpServer.close();
            if (httpsServer) httpsServer.close();

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