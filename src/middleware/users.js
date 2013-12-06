var app = require('../app.js').instance;
var log = require('../log/log.js').getLog(__filename);
var errors = require('../mongo/errors.js');

var User = require('../mongo/models/user.js');
var checkAuth = require('./checkAuth.js');

var common = require('./common.js');

app.get('/users/list', checkAuth, function(req, res) {
    User.find({}, common.json(req, res));
});

app.get('/users/get', checkAuth, function(req, res) {
    log.debug('requesting user with id: ', req.query.id);
    User.findById(req.query.id, common.json(req, res));
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

    john.save(common.json(req, res));
});