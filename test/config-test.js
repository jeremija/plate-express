var config = require('../src/config.js');

describe('config.js', function() {
    it('should be ok', function() {
        expect(config).to.be.ok();
    });
    it('should have set mongo.url', function() {
        expect(config.mongo).to.be.ok();
        expect(config.mongo.url).to.be.a('string');
    });
    it('should have set log.type', function() {
        expect(config.log).to.be.ok();
        expect(config.log.type).to.be.a('string');
        expect(config.log.type.length).to.be.greaterThan(0);
    });
})