var app = require('../app.js').instance;

var Company = require('../mongo/models/company.js');
var checkAuth = require('./checkAuth.js');
var common = require('./common.js');

app.get('/companies/find', checkAuth, function(req, res) {
    Company.find(req.query, common.json(req, res));
});

app.get('/companies/get/:shortId', checkAuth, function(req, res) {
    var shortId = req.route.params.shortId;

    Company.findOne({
        shortId: shortId
    }, common.json(req, res));
});

app.post('/companies/save', checkAuth, function(req, res) {
    var data = req.body;
    common.setShortId(data);
    Company.findOneAndUpdate({
        shortId: data.shortId
    }, data, {
        upsert: true
    }, common.json(req, res));
});

app.post('/companies/delete', checkAuth, function(req, res) {
    var shortId = req.body.shortId;
    Company.findOneAndRemove({
        shortId: shortId
    }, {}, common.json(req, res));
});