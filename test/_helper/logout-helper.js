var User = require('../../src/mongo/models/user.js');
var logonHelper = require('./logon-helper.js');

before(function(done) {
    request(app).
        get('/logout').
        set('cookie', module.exports.sessionCookie).
        expect(403).
        end(function(err) {
            if (err) {
                done(err);
            }
            User.find({
                email: 'john@travolta.com'
            }).remove(function(err) {
                logonHelper.sessionCookie = undefined;
                done(err);
            });
        });
});