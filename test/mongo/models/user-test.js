var User = require('../../../src/mongo/models/user.js');

describe(__filename, function() {

    // connect to the db before tests and disconnect afterwards
    require('../../_helper/mongo-helper.js').init();

    it('should create and fail to save because of validation', function() {
        var user = new User({
            firstName: 'jack',
            lastName: 'johnson'
        });
        //validationFailed
        expect(user.save).to.throwError();
    });

    var user;
    it('should create and save new user', function(done) {
        user = new User({
            firstName: 'jack',
            lastName: 'johnson',
            email: 'jack@johnson.com',
            enabled: false
        });

        user.setPassword('pwdtest123');
        expect(user.isPasswordValid('pwd123')).to.be(false);
        expect(user.isPasswordValid('pwdtest123')).to.be(true);

        user.save(function(err, user) {
            expect(err).to.not.be.ok();
            expect(user._id).to.be.ok();
            done();
        });
    });

    it('should be able to fetch the user', function(done) {
        User.findById(user._id, function(err, foundUser) {
            expect(foundUser.email).to.be(user.email);
            done();
        });
    });

    it('should be able to remove the user', function(done) {
        user.remove(function(err, user) {
            expect(err).to.not.be.ok();
            User.findById(user._id, function(err, foundUser) {
                expect(err).to.not.be.ok();
                expect(foundUser).to.not.be.ok();
                done();
            });
        });
    });
});