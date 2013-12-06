var app = require('../app.js').instance;

var CarInsurance = require('../mongo/models/car-insurance.js');
var checkAuth = require('./checkAuth.js');
var common = require('./common.js');

app.get('/carinsurances/find', checkAuth, function(req, res) {
    CarInsurance.find(req.query, common.json(req, res));
});

app.get('/carinsurances/get/:shortId', checkAuth, function(req, res) {
    CarInsurance.findOne({
        shortId: req.route.params.shortId
    }, common.json(req, res));
});

app.post('/carinsurances/save', checkAuth, function(req, res) {
    var data = req.body;
    common.setShortId(data);
    CarInsurance.findOneAndUpdate({
        shortId: data.shortId
    }, data, {
        upsert: true
    }, common.json(req, res));
});

app.post('/carinsurances/delete', checkAuth, function(req, res) {
    var shortId = req.body.shortId;
    Company.findOneAndRemove({
        shortId: shortId
    }, {}, common.json(req, res));
});