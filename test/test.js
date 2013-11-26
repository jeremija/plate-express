global.expect = require('expect.js');
// global.proxyquire = require('proxyquire');
global.request = require('supertest');

require('./config-test.js'); //automatically included
require('./log/console-logger-test.js');
// this test sets the logger to return-logger which suppresses the output
// during tests
require('./log/log-test.js');

require('./mongo/mongoose-test.js');
require('./mongo/models/user-test.js');

describe('START SERVER', function() {
    it('starting server...', function(done) {
        // start the server for testing middleware
        require('../src/startup.js').start(function(err) {
            global.app = require('../src/app.js').instance;
            done(err);
        });
    });
});

// add modules which test app middleware here
require('./middleware/users-test.js');
require('./middleware/login-test.js');

describe('STOP SERVER', function() {
    it('stopping server...', function(done) {
        require('../src/startup.js').stop(done);
    });
});