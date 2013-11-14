var mongooseConfig = require('../../src/mongo/mongoose.js');
var config = require('../../src/config.js');

describe('mongo/mongoose.js', function() {
    var connection;
    it('should connect without errors', function(done) {
        mongooseConfig.init(config.mongo.url, function(err, conn) {
            expect(err).to.be(undefined);
            expect(conn).to.be.ok();
            connection = conn;
            done();
        });
    });
    it('should disconnect without errors', function(done) {
        if (!connection) {
            throw new Error('connection ' + connection);
        }
        connection.once('close', function() {
            done();
        });
        connection.close();
    });
});