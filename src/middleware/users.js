var app = require('../app.js').instance;
var log = require('../log/log.js').getLog(__filename);

var User = require('../mongo/models/user.js');


app.get('/users/list', function(req, res) {
    User.find({}, function(err, users) {
        if (err) throw new Error('error while fetching user data', err);
        log.debug('/users/list:', users);
        res.json(users);
    });
});

app.get('/users/get', function(req, res) {
    log.debug('requesting user with id: ', req.query.id);
    User.findById(req.query.id, function(err, user) {
        if (err) throw new Error('error while finding user by id', err);

        //res.send(JSON.stringify(user.toObject()));
       //res.setHeader('Content-Type', 'application/json');
        res.json(user.toObject());
    });
});

//should be post
app.get('/users/add', function(req, res) {
    log.debug('adding user');

    var john = new User({
        firstName: 'John',
        lastName: 'Travolta',
        email: 'john@travolta.com',
        enabled: true
    });

    john.setPassword('jontra');

    john.save(function(err) {
        if (err) {
            log.error('error while saving user', err.message, err);
            return;
        }

        log.debug('user saved');
        res.send('user saved');
    });
});