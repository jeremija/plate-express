var mongoose = require('mongoose');
var errors = require('../mongo/errors.js');
var keygen = require('../util/keygen.js');
// var log = require('../log/log.js').getLog(__filename);

/**
 * Sets the `shortId` to the object.
 * @param {Object} data   Object to set the `shortId` field to
 * @param {String} field Object's property to take the name from.
 */
module.exports.setShortId = function(data, field) {
    if (typeof data.shortId === 'string') {
        return;
    }
    field = field || 'name';
    var value = data[field];
    data.shortId = keygen.generate(value);
};

/**
 * Creates a callback for mongoose query. If there is an error, reports the
 * error using {@link errors#handleError}.
 * @param  {http.ServerResponse} res
 */
module.exports.json = function(req, res) {
    var url = req.url;
    return function(err, data) {
        if (err) {
            errors.handleError(url, err, res);
            return;
        }
        res.json({
            error: undefined,
            data: data
        });
    };
};