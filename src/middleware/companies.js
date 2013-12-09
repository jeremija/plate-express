var app = require('../app.js').instance;

var Company = require('../mongo/models/company.js');
var errors = require('../mongo/errors.js');
var checkAuth = require('./checkAuth.js');
var common = require('./common.js');

app.get('/companies/find', checkAuth, function(req, res) {
    Company.find(req.query, common.json(req, res));
});

app.get('/companies/get/:shortId', checkAuth, function(req, res) {
    Company.findOne({
        shortId: req.route.params.shortId
    }, common.json(req, res));
});

app.post('/companies/save', checkAuth, function(req, res) {
    var data = req.body;

    Company.findOne({shortId: data.shortId}, function(err, company) {
        if (err) return errors.handleError(req.url, err, res);
        if (!company) {
            company = new Company(data);
            common.setShortId(company);
        }
        else {
            company.name = data.name;
            company.oib = data.oib;
        }
        company.save(common.json(req, res));
    });

    // data = req.body;
    // delete data._id;
    // common.setShortId(data);
    // Company.findOneAndUpdate({
    //     shortId: data.shortId
    // }, data, {
    //     upsert: true
    // }, common.json(req, res));
});

app.post('/companies/delete', checkAuth, function(req, res) {
    var shortId = req.body.shortId;
    Company.findOneAndRemove({
        shortId: shortId
    }, {}, common.json(req, res));
});