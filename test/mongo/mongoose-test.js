var mongooseConfig = require('../../src/mongo/mongoose.js');
var config = require('../../src/config.js');

describe(__filename, function() {
    var connection;
    it('should connect without errors', function(done) {
        mongooseConfig.init(config.mongo.url, function(err, conn) {
            if (err) {
                done(err);
                return;
            }
            expect(conn).to.be.ok();
            connection = conn;
            done();
        });
    });
    it('should disconnect without errors', function(done) {
        if (!connection) {
            done(new Error('connection ' + connection));
            return;
        }
        connection.once('close', function() {
            done();
        });
        connection.close();
    });
});