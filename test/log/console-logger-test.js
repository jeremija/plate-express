var log = require('../../src/log/console-logger.js');

describe(__filename, function() {
    it('should have property type set', function() {
        expect(log.type).to.be('console');
    });
    it('should have functions for logging set', function() {
        expect(log.debug).to.be.a('function');
        expect(log.warn).to.be.a('function');
        expect(log.error).to.be.a('function');
    });
});