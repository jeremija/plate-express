var User = require('../../src/mongo/models/user.js');

describe(__filename, function() {

    before(function(done) {
        var user = new User({
            firstName: 'john',
            lastName: 'travolta',
            email: 'john2@travolta.com',
            enabled: true
        });

        user.setPassword('jontra');
        user.save(function(err) {
            done(err);
        });
    });

    after(function(done) {
        User.find({
            email: 'john2@travolta.com'
        }).remove(function(err) {
            done(err);
        });
    });

    describe('GET /logout', function() {
        it('forbidden because user was never logged in', function(done) {
            request(app).
                get('/logout').
                expect(403).
                end(done);
        });
    });

    var sessionCookie;

    describe('POST /login', function() {
        //TODO before create test user
        //TODO after clear session and remove test user

        it('the user should not be found', function(done) {
            request(app).
                post('/login').
                send({
                    'email': 'test@test.com',
                    'password': 'testpwd'
                }).
                expect(200).
                expect(/error.authentication/).
                end(function(err, res) {
                    //console.log('err', err);
                    done(err);
                });
        });

        it('the user should be found, but password invalid', function(done) {
            request(app).
                post('/login').
                send({
                    'email': 'john2@travolta.com',
                    'password': 'some-invalid-password'
                }).
                expect(200).
                expect(/error.authentication/).
                end(function(err, res) {
                    done(err);
                });
        });

        it('the user should be found and session set', function(done) {
            request(app).
                post('/login').
                send({
                    'email': 'john2@travolta.com',
                    'password' : 'jontra'
                }).
                expect(200).
                expect(/john2@travolta.com/).
                end(function(err, res) {
                    if (err) done(err);
                    expect(res.header['set-cookie'].length).to.be(1);
                    sessionCookie = res.header['set-cookie'][0];
                    expect(sessionCookie).to.be.ok();
                    done();
                });
        });
    });

    describe('GET /logout', function(done) {
        it('should logout the user', function(done) {
            request(app).
                get('/logout').
                set('cookie', sessionCookie).
                expect(200).
                end(function(err, res) {
                    //make sure that the cookie is now expired
                    expect(res.header['set-cookie'].length).to.be(1);
                    expect(res.header['set-cookie'][0]).to.contain(
                        'Expires=Thu, 01 Jan 1970 00:00:00 GMT');
                    done();
                });
        });
    });
});