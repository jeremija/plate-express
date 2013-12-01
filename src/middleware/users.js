var app = require('../app.js').instance;
var log = require('../log/log.js').getLog(__filename);

var User = require('../mongo/models/user.js');
var checkAuth = require('./checkAuth.js');

app.get('/users/list', checkAuth, function(req, res) {
    User.find({}, function(err, users) {
        if (err) {
            log.error('/users/list: error while fetching user data', err);
            res.json({err: 'error.find'});
        }
        res.json({err: undefined, data: users});
    });
});

app.get('/users/get', checkAuth, function(req, res) {
    log.debug('requesting user with id: ', req.query.id);
    User.findById(req.query.id, function(err, user) {
        if (err) {
            log.error('/users/get: error while finding user', err);
            res.json({err: 'error.find', data: user});
        }

        //res.send(JSON.stringify(user.toObject()));
        //res.setHeader('Content-Type', 'application/json');
        res.json({err: undefined, data: user});
    });
});

//should be post
app.post('/users/add', checkAuth, function(req, res) {
    log.debug('adding user');

    var john = new User({
        firstName: 'John',
        lastName: 'Travolta',
        email: 'john@travolta.com',
        enabled: true
    });

    john.setPassword('jontra');

    john.save(function(err, user) {
        if (err) {
            log.error('/users/add: error while saving user', err);
            res.json({err: 'error.save'});
            return;
        }

        log.debug('user saved: ' + john.toObject());
        res.json({err: undefined, data: user});
    });
});