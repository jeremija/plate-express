var log = require('../log/log.js').getLog(__filename);

var mongoErrors = {
    10003: 'error.db.capped',
    11000: 'error.db.duplicate',
    11001: 'error.db.duplicate',
    12000: 'error.db.internal',
    12001: 'error.db.internal',
    12010: 'error.db.internal',
    12011: 'error.db.internal',
    12012: 'error.db.internal',
    13312: 'error.db.internal',
    13440: 'error.db.internal'
};

module.exports.handleError = function(err, res) {
    log.error('an error has occurred: ', err, err.stack);
    switch(err.name) {
        case 'ValidationError':
            res.json({error: err});
            break;
        case 'MongoError':
            var msg = mongoErrors[err.code];
            res.json({error: {name: 'DatabaseError', message: msg}});
            break;
        default:
            console.log(err);
            res.json({error: {name: 'Server', message: 'error.server'}});
    }
    return true;
};

module.exports.badRequest = function(res) {
    res.json(400, {
        error: {
            name: 'BadRequest',
            message: 'error.invalid.url.params'
        }
    });
};