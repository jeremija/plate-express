var User = require('../../src/mongo/models/user.js');

before(function(done) {
    var user = new User({
        firstName: 'john',
        lastName: 'travolta',
        email: 'john@travolta.com',
        enabled: true
    });

    user.setPassword('jontra');
    user.save(function(err) {
        request(app).
            post('/login').
            send({
                'email': 'john@travolta.com',
                'password': 'jontra'
            }).
            expect(200).
            expect(/john@travolta.com/).
            end(function(err, res) {
                module.exports.sessionCookie = res.header['set-cookie'][0];
                done(err);
            });
    });
});

after(function(done) {
    request(app).
        get('/logout').
        set('cookie', module.exports.sessionCookie).
        expect(403).
        end(function() {
            User.find({
                email: 'john@travolta.com'
            }).remove(function(err) {
                module.exports.sessionCookie = undefined;
                done(err);
            });
        });
});

module.exports.sessionCookie = undefined;