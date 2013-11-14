var User = require('../mongo/models/user.js');
var app = require('../app.js').instance;
var log = require('../log/log.js').getLog(__filename);

module.exports.checkAuth = function(req, res, next) {
    log.debug('checking if user is authorized');
    if (!req.session || !req.session.userId) {
        log.debug('user is not authorized');
        res.send('you are not authorized to view this page');
    }
    else {
        log.debug('user is authorized. userId:', req.session.userId);
        next();
    }
};

app.get('/logout', function(req, res) {
    if (!req.session || !req.session.userId) {
        res.status(403).send('you were never logged in');
        req.session = null;
        return;
    }
    req.session = null;

    res.send('you have logged out');
});

app.post('/login', function(req, res) {
    var email = req.body.email;
    var password = req.body.password;

    log.debug('trying to find an user with email', email);

    User.findOne({
        email: email
    }, function(err, user) {

        if (err) {
            log.debug('an error ocurred while finding user with email', email);
            res.send('error');
            return;
        }

        if (!user) {
            log.debug('user with email', email, 'not found');
            res.send('user not found');
            return;
        }

        if (!user.isPasswordValid(password)) {
            log.debug('user with email', email, 'found, but invalid password');
            req.session = null;
            //TODO use json format
            res.send('invalid password');
            return;
        }

        log.debug('user with email', email, 'found. logging in...');
        req.session = {
            userId: email
        };
        res.send('logged in');
    });
});