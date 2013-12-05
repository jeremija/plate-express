var Company = require('../../../src/mongo/models/company.js');
var keygen = require('../../../src/util/keygen.js');

describe(__filename, function() {

    // connect to the db before tests and disconnect afterwards

    var company;
    before(function() {
        company = new Company({
            name: '1',
            oib: 123,
            shortId: keygen.generate(this.name)
        });
    });

    after(function(done) {
        // remove the company from the database
        company.remove(function(err) {
            done(err);
        });
    });

    require('../../_helper/mongo-helper.js').init();

    it('should fail to save because name invalid', function(done) {
        company.save(function(err, company) {
            expect(err && err.errors && err.errors.oib).to.be.ok();
            expect(err.errors.name).to.be.ok();
            expect(err.errors.name.message).to.be('error.invalid.company.name');
            expect(err.errors.oib.message).to.be('error.invalid.company.oib');
            done();
        });
    });
    it('should fail to save because of invalid oib', function(done) {
        company.name = '12';
        company.shortId = keygen.generate(company.name);

        company.save(function(err, company) {
            expect(err && err.errors && err.errors.oib).to.be.ok();
            expect(err.errors.name).to.not.be.ok();
            expect(err.errors.oib.message).to.be('error.invalid.company.oib');
            done();
        });
    });
    it('should save successfully', function(done) {
        company.oib = '04082175950';

        company.save(function(err, company) {
            expect(err).to.not.be.ok();
            expect(company).to.have.property('_id');
            expect(company).to.have.property('shortId');
            expect(company.shortId).to.match(/12222-[0-9a-f]{6}/);
            done();
        });
    });
    it('should update successfully', function(done) {
        company.name = 'changed name';

        company.save(function(err, company) {
            expect(err).to.not.be.ok();
            expect(company).to.have.property('_id');
            expect(company).to.have.property('shortId');
            expect(company.shortId).to.match(/12222-[0-9a-f]{6}/);
            expect(company.name).to.be('changed name');
            done();
        });
    });
});