var log = require('../log/log.js').getLog(__filename);

module.exports = function(req, res, next) {
    log.debug('checking if user is authorized');
    if (!req.session || !req.session.userId) {
        log.debug('user is not authorized');
        res.status(401).send('you are not authorized to view this page');
    }
    else {
        log.debug('user is authorized. userId:', req.session.userId);
        next();
    }
};