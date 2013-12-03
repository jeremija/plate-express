describe(__filename, function() {
	var oibValidator = require('../../src/validators/oib-validator');

    describe('validate()', function() {
        it('should be a function', function() {
            expect(oibValidator.validate).to.be.a('function');
        });
        it('should return false on invalid oib', function() {
            var retVal = oibValidator.validate('12345678901');
            expect(retVal).to.be(false);

            retVal = oibValidator.validate('3243');
            expect(retVal).to.be(false);

            retVal = oibValidator.validate('423354354354353');
            expect(retVal).to.be(false);

            retVal = oibValidator.validate('abcdefg');
            expect(retVal).to.be(false);
        });
        it('should return true on valid oib', function() {
            var retVal = oibValidator.validate('04082175950');
            expect(retVal).to.be(true);
        });
    });
});