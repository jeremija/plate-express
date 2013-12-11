var app = require('../app.js').instance;

var Company = require('../mongo/models/company.js');
var RefError = require('../errors/RefError.js');
var CarInsurance = require('../mongo/models/car-insurance.js');
var errors = require('../mongo/errors.js');
var checkAuth = require('./checkAuth.js');
var common = require('./common.js');
var async = require('async');
var log = require('../log/log.js').getLog(__filename);

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
            common.copyProperties(data, company);
        }
        company.save(common.json(req, res));
    });
});

app.post('/companies/delete', checkAuth, function(req, res) {
    var shortId = req.body.shortId;
    // var _id = req.body._id;

    log.debug('/companies/delete', 'reqBody=', req.body);
    var _id;

    async.series({
        foundCompany: function(callback) {
            Company.findOne({
                shortId: shortId
            }, function(err, company) {
                if (!err && company) _id = company._id;
                callback(err, company);
            });
        },
        carInsurancesCount: function(callback) {
            CarInsurance.count({
                company: _id
            }, function(err, count) {
                if (err) return callback(err);
                log.debug('/companies/delete', 'carInsurancesCount=', count);
                if (count > 0) return callback(
                    new RefError('error.delete.is.referred.to'));
                callback(err, count);
            });
        },
        company: function(callback) {
            Company.findOneAndRemove({
                _id: _id
                // shortId: shortId
            }, {}, callback);
        }
    }, function(err, results) {
        log.debug('/companies/delete', 'err', err, 'results', results);
        common.json(req, res).call(common, err, results.company);
    });

});

// app.post('/companies/delete', checkAuth, function(req, res) {
//     var shortId = req.body.shortId;
//     Company.findOneAndRemove({
//         shortId: shortId
//     }, {}, common.json(req, res));
// });