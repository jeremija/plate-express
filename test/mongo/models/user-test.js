var mongooseConfig = require('../../../src/mongo/mongoose.js');
var User = require('../../../src/mongo/models/user.js');
var config = require('../../../src/config.js');

describe('mongo/models/user.js', function() {
    var connection;
    before(function(done) {
        mongooseConfig.init(config.mongo.url, function(err, conn) {
            expect(err).to.not.be.ok();
            expect(conn).to.be.ok();
            connection = conn;
            done();
        });
    });

    after(function(done) {
        connection.once('close', function() {
            done();
        });
        connection.close();
    });

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