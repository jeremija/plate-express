var app = require('../app.js').instance;
var log = require('../log/log.js').getLog(__filename);
var errors = require('../mongo/errors.js');

app.get('/test/success', function(req, res) {
    res.json({data: 'data-received'});
});

app.get('/test/error', function(req, res) {
    var err = new Error('error12345');
    errors.handleError('/test/error', err, res, true);
});
