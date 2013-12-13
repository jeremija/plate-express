var log = require('./log/log.js').getLog(__filename);
var config = require('./config.js');
var express = require('express');

function setStaticFolders(p_app, p_folders) {
    if (!p_folders || p_folders.length === 0) {
        log.debug('no public folders to set');
        return;
    }

    for (var i in p_folders) {
        var folder = p_folders[i];
        log.debug('setting public folder', folder);
        p_app.use(express.static(__dirname + folder));
    }
}

module.exports.init = function() {
    var app = express();

    //make this app instance available to other modules
    module.exports.instance = app;

    setStaticFolders(app, config.express.publicFolders);

    app.use(function(req, res) {
        //log request urls TODO write client's IP address
        log.debug('request:', req.originalUrl);
        req.next();
    });

    //cookieSession for handling user session
    app.use(express.cookieParser(config.express.sessionSecret));
    app.use(express.cookieSession({
        secure: config.express.sessionSecure ? true : false
    }));

    //to be able to read the req.body parameters on POST request
    log.debug('registering bodyParser');
    app.use(express.bodyParser());

    //middleware
    require('./middleware');

    app.use(require('./middleware/checkAuth'));

    // setStaticFolders(app, config.express.privateFolders);

    //invalid url handler
    app.use(function(req, res) {
        res.status(404).json({
            error: {
                name: 'NotFound',
                key: 'error.not.found'
            }
        });
    });

    // var port = p_port;

    // var httpServer = http.createServer(app);
    // httpServer.listen(port);

    // var httpsServer = https.createServer(credentials, app);
    // var server = app.listen(port);

    log.debug('initialized app');

    return app;
};