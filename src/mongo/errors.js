var log = require('../log/log.js').getLog(__filename);

var mongoErrors = {
    10003: 'error.db.capped',
    11000: 'error.db.duplicate',
    11001: 'error.db.duplicate',
    // 12000: 'error.db.internal',
    // 12001: 'error.db.internal',
    // 12010: 'error.db.internal',
    // 12011: 'error.db.internal',
    // 12012: 'error.db.internal',
    // 13312: 'error.db.internal',
    // 13440: 'error.db.internal',
};

function getMongoErrorKey(err) {
    var msg = mongoErrors[err.code];
    if (msg) return msg;

    msg = err.lastErrorObject ?
        mongoErrors[err.lastErrorObject.code] :
        undefined;

    return msg || 'error.db.internal';
}

/**
 * Handles an error
 * @param  {String}   url
 * @param  {Error}    err
 * @param  {Response} res
 * @param  {Boolean}  silent  Skip log if true
 */
module.exports.handleError = function(url, err, res, silent) {
    if (!silent) {
        log.error('an error has occurred on url ' + url, err, err.stack);
    }
    switch(err.name) {
        case 'ValidationError':
            res.json(400, {error: {name: 'ValidationError',
                details: err, key: 'error.validation'}});
            break;
        case 'CastError':
            var errors = {};
            errors[err.path] = err;

            res.json(400, {
                error: {
                    name: 'ValidationError',
                    details: {
                        errors: errors
                    }
                }
            });
            break;
        case 'MongoError':
            var msg = getMongoErrorKey(err);
            res.json(400, {error: {name: 'DatabaseError', key: msg}});
            break;
        case 'RefError':
            res.json(400, {error: err});
            break;
        default:
            res.json(500, {error: {name: 'Server', key: 'error.server'}});
    }
    return true;
};

module.exports.badRequest = function(res) {
    res.json(400, {
        error: {
            name: 'BadRequest',
            key: 'error.invalid.url.params'
        }
    });
};