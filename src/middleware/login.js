var User = require('../mongo/models/user.js');
var app = require('../app.js').instance;
var log = require('../log/log.js').getLog(__filename);

app.get('/logout', function(req, res) {
    // if (!req.session || !req.session.userId) {
    //     res.json(403, {
    //         err: 'error.logout'
    //     });
    //     req.session = null;
    //     return;
    // }
    req.session = null;

    res.json({
        err: undefined,
        data: 'logout.success'
    });
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
            res.json(500, {
                error: {
                    name: 'Server',
                    key: 'error.internal'
                }
            });
            return;
        }

        if (!user) {
            log.debug('user with email', email, 'not found');
            res.json(401, {
                error: {
                    name: 'Authentication',
                    key: 'error.authentication'
                }
            });
            return;
        }

        if (!user.isPasswordValid(password)) {
            log.debug('user with email', email, 'found, but invalid password');
            req.session = null;
            //TODO use json format
                res.json(401, {
                    error: {
                        name: 'Authentication',
                        key: 'error.authentication'
                    }
                });
            return;
        }

        log.debug('user with email', email, 'found. logging in...');
        console.log('req.session.cookie', req.session.cookie);

        // 10 hrs
        var age = 10*60*60*1000;
        req.session.cookie.expires = new Date(Date.now() + age);
        req.session.cookie.maxAge = age;
        req.session.userId = email;

        res.json({err: undefined, data: user.toObject()});
    });
});