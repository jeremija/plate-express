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

module.exports.create = function(p_port) {
    var app = express();

    setPublicFolders(app, config.express.publicFolders);
    app.use(function(req, res) {
        log.debug('request:', req.originalUrl);
        req.next()
    });

    var port = process.env.PORT || p_port;
    app.listen(port);

    log.debug('listening on port', port);

    return app;
};