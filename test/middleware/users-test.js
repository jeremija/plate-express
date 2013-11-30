describe(__filename, function() {

    var User = require('../../src/mongo/models/user.js');
    var logonHelper = require('../_helper/logon-helper.js');

    describe('GET /users/list', function(done) {
        it('should have content type json', function(done) {
            request(app).
                get('/users/list').
                set('cookie', logonHelper.sessionCookie).
                expect('Content-Type', /json/).
                //expect(/^\[\s*?\]$/m).
                expect(/firstName": *?"john"/).
                expect(/john@travolta\.com/).
                end(function(err, res) {
                    done(err);
                });
        });
    });
});