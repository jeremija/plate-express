var app = require('../app.js').instance;

var CarInsurance = require('../mongo/models/car-insurance.js');
var Company = require('../mongo/models/company.js');
var checkAuth = require('./checkAuth.js');
var common = require('./common.js');

app.get('/carinsurances/find', checkAuth, function(req, res) {
    CarInsurance.find(req.query).populate({
        path: 'company',
        select: 'name'
    }).exec(common.json(req, res));
});

app.get('/carinsurances/find/:companyShortId', function(req, res) {
    Company.findOne({
        shortId: req.route.params.companyShortId
    }, function(err, company) {
        if (err) return errors.handleError(req.url, err, res);
        req.query.company = company._id;
        CarInsurance.find(req.query, common.json(req, res));
    });
});

app.get('/carinsurances/get/:shortId', checkAuth, function(req, res) {
    CarInsurance.findOne({
        shortId: req.route.params.shortId
    }, common.json(req, res));
});

app.post('/carinsurances/save', checkAuth, function(req, res) {
    var data = req.body;

    CarInsurance.findOne({shortId: data.shortId}, function(err, carInsurance) {
        if (err) return errors.handleError(req.url, err, res);

        if (!carInsurance) {
            carInsurance = new CarInsurance(data);
            common.setShortId(carInsurance);
        }
        else {
            common.copyProperties(data, carInsurance);
        }

        carInsurance.save(common.json(req, res));
    });
});

app.post('/carinsurances/delete', checkAuth, function(req, res) {
    var shortId = req.body.shortId;
    CarInsurance.findOneAndRemove({
        shortId: shortId
    }, {}, common.json(req, res));
});