var app = require('../app.js').instance;
var log = require('../log/log.js').getLog(__filename);

app.get('/test/success', function(req, res) {
    res.json({value: 'ok'});
});

app.get('/test/error404', function(req, res) {
    res.json(404, {error: 'error.not.found'});
});

app.get('/test/error400', function(req, res) {
    res.json(400, {error: 'error.bad.request'});
});