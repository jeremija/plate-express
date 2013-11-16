var log = require('./log/log.js').getLog(__filename);
var config = require('./config.js');
var express = require('express');

function setPublicFolders(p_app, p_folders) {
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

module.exports.init = function(p_port) {
    var app = express();

    //make this app instance available to other modules
    module.exports.instance = app;

    setPublicFolders(app, config.express.publicFolders);
    app.use(function(req, res) {
        //log request urls TODO write client's IP address
        log.debug('request:', req.originalUrl);
        req.next();
    });

    //cookieSession for handling user session
    app.use(express.cookieParser(config.express.sessionSecret));
    app.use(express.cookieSession());

    //to be able to get the req.body parameters on POST request
    log.debug('registering bodyParser');
    app.use(express.bodyParser());

    //middleware
    require('./middleware');

    //invalid url handler
    app.use(function(req, res) {
        res.status(404).send('invalid url');
    });

    var port = p_port;
    var server = app.listen(port);

    log.debug('listening on port', port);

    return server;
};