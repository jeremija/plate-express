var CarInsurance = require('../../../src/mongo/models/car-insurance.js');
var Company = require('../../../src/mongo/models/company.js');
var keygen = require('../../../src/util/keygen.js');

describe(__filename, function() {

    var carInsurance, company;
    before(function() {
        carInsurance = new CarInsurance({
            name: 'vw golf gti',
            carYear: 1988,
            licensePlate: 'zg1234a',
            policyNumber: '123456789012',
            expires: Date.now() + 1000000000,
            power: 120,
            vehicleType: 'PERSONAL',
        });
        company = new Company({
            name: 'test-company',
            oib: '04082175950'
        });
        company.shortId = keygen.generate(company.name);
    });

    after(function(done) {
        company.remove(function(err) {
            done(err);
        });
    });

    // connect to the db before tests and disconnect afterwards
    require('../../_helper/mongo-helper.js').init();

    before(function(done) {
         company.save(function(err, data) {
            if (err) done(err);
            expect(data).to.be.ok();
            done();
        });
    });

    describe('save', function() {
        it('should save successfully', function(done) {
            carInsurance.shortId = keygen.generate(carInsurance.name);
            carInsurance.company = company._id;

            carInsurance.save(function(err, data) {
                if (err) return done(err);
                expect(data).to.be.ok();
                done();
            });
        });
    });

    describe('find and populate', function() {
        it('should find car insurance and populate company', function(done) {
            CarInsurance.findOne(carInsurance).populate('company')
                .exec(function(err, data) {
                    if (err) return done(err);
                    expect(err).to.not.be.ok();
                    expect(data).to.be.ok();
                    expect(data.company).to.be.ok();
                    expect(data.company.name).to.be('test-company');
                    done();
                });
        });
    });

    describe('remove', function(done) {
        it('should remove without errors', function(done) {
            carInsurance.remove(function(err, data) {
                if (err) return done(err);
                expect(data).to.be.ok();
                done();
            });
        });
    });
});