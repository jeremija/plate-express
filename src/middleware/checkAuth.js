var log = require('../log/log.js').getLog(__filename);

module.exports = function(req, res, next) {
    log.debug('checking if user is authorized');

    if (!req.session || !req.session.userId) {
        log.debug('user is not authorized');
        res.status(401).json({err: 'not.authorized'});
    }
    else {
        log.debug('user is authorized. userId:', req.session.userId);
        next();
    }
};