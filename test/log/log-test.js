describe(__filename, function() {
    describe('invalid config.log.type', function() {
        it('should load the default logger', function() {
            require('../../src/config.js').log.type = 'invalid-logger-type';
            var log = require('../../src/log/log.js').getLog('test');

            expect(log.debug).to.be.a('function');
            expect(log.warn).to.be.a('function');
            expect(log.error).to.be.a('function');
            expect(log.loggerInstance.debug).to.be.a('function');
            expect(log.loggerInstance.warn ).to.be.a('function');
            expect(log.loggerInstance.error).to.be.a('function');
            expect(log.loggerInstance.type).to.be('console');
        });
    });

    describe('valid config.log.type: console-logger.js', function() {
        it('should load the console-logger.js logger', function() {
            require('../../src/config.js').log.type = 'console-logger.js';
            var log = require('../../src/log/log.js').getLog('test');

            expect(log.debug).to.be.a('function');
            expect(log.warn).to.be.a('function');
            expect(log.error).to.be.a('function');
            expect(log.loggerInstance.debug).to.be.a('function');
            expect(log.loggerInstance.warn ).to.be.a('function');
            expect(log.loggerInstance.error).to.be.a('function');
            expect(log.loggerInstance.type).to.be('console');
        });
    });

    describe('compare log values using return-logger.js', function() {
        var log;
        it('should load the return-logger.js logger', function() {
            require('../../src/config.js').log.type = '../../test/log/return-logger.js';
            log = require('../../src/log/log.js').getLog('test');

            expect(log).to.be.ok();
            expect(log.loggerInstance.type).to.be('return-logger');
        });

        var STRING = 'this is a test string';
        it('should write \'DEBUG test> ' + STRING + '\'', function() {
            expect(log.debug(STRING)).to.be('DEBUG test> ' + STRING);
        });
        it('should write \'WARN  test> ' + STRING + '\'', function() {
            expect(log.warn(STRING)).to.be('WARN  test> ' + STRING);
        });
        it('should write \'ERROR test> ' + STRING + '\'', function() {
            expect(log.error(STRING)).to.be('ERROR test> ' + STRING);
        });
    });

});