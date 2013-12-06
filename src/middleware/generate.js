var app = require('../app.js').instance;
var log = require('../log/log.js').getLog(__filename);
var errors = require('../mongo/errors.js');
var mongoose = require('mongoose');
var keygen = require('../util/keygen.js');

var checkAuth = require('./checkAuth.js');

module.exports.middleware = function(p_model, p_restPath) {
    var Model = p_model;

    if (!Model) {
        throw new Error('model not defined for path ' + p_restPath);
    }
    if (typeof p_restPath !== 'string' || !p_restPath.length) {
        throw new Error('invalid p_restPath ' + p_restPath);
    }

    function path(p_action) {
        return p_restPath + '/' + p_action;
    }

    app.get(path('find'), checkAuth, function(req, res) {
        Model.find(req.query, function(err, data) {
            if (err) return erros.handleError(err, res);
            res.json({data: data});
        });
    });

    app.get(path('get/:shortId'), checkAuth, function(req, res) {
        var shortId = req.route.params.shortId;

        Model.findOne({shortId: shortId}, function(err, data) {
            if (err) return errors.handleError(err, res);
            res.json({data: data});
        });
    });

    app.post(path('save'), checkAuth, function(req, res) {
        var data = req.body;
        data.shortId = data.shortId || keygen.generate(data.name);
        Model.findOneAndUpdate({
            shortId: data.shortId
        }, data, {
            upsert: true
        }, function(err, data) {
            if (err) return errors.handleError(err, res);
            res.json({error: undefined, data: data});
        });
    });

    app.post(path('delete'), checkAuth, function(req, res) {
        var shortId = req.body.shortId;
        Model.findOneAndRemove({
            shortId: shortId
        }, {}, function(err, data) {
            if (err) return errors.handleError(err, res);
            res.json({error: undefined, data: data});
        });
    });
};