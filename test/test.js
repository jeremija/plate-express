global.expect = require('expect.js');

global.proxyquire = require('proxyquire');

require('./config-test.js');
require('./log/console-logger-test.js');
require('./log/log-test.js');