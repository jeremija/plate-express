var app = require('../app.js').instance;
var log = require('../log/log.js').getLog(__filename);
var errors = require('../mongo/errors.js');
var mongoose = require('mongoose');
var keygen = require('../util/keygen.js');
var Company = require('../mongo/models/company.js');

var checkAuth = require('./checkAuth.js');

app.get('/companies/find', checkAuth, function(req, res) {
    Company.find(req.query, function(err, data) {
        if (err) return erros.handleError(err, res);
        res.json({data: data});
    });
});

app.get('/companies/get/:shortId', checkAuth, function(req, res) {
    var shortId = req.route.params.shortId;

    Company.findOne({shortId: shortId}, function(err, data) {
        if (err) return errors.handleError(err, res);
        res.json({data: data});
    });
});

app.post('/companies/save', checkAuth, function(req, res) {
    var data = req.body;
    data.shortId = data.shortId || keygen.generate(data.name);
    Company.findOneAndUpdate({
        shortId: data.shortId
    }, data, {
        upsert: true
    }, function(err, data) {
        if (err) return errors.handleError(err, res);
        res.json({error: undefined, data: data});
    });
});

app.post('/companies/delete', checkAuth, function(req, res) {
    var shortId = req.body.shortId;
    Company.findOneAndRemove({
        shortId: shortId
    }, {}, function(err, data) {
        if (err) return errors.handleError(err, res);
        res.json({error: undefined, data: data});
    });
});