var mongooseConfig = require('../../src/mongo/mongoose.js');
var config = require('../../src/config.js');

var connection;

module.exports.init = function() {
    before(function(done) {
        mongooseConfig.init(config.mongo.url, function(err, conn) {
            if (err) {
                done(err);
                return;
            }
            expect(conn).to.be.ok();
            connection = conn;
            console.log('mongodb connected');
            done();
        });
    });
    after(function(done) {
        connection.once('close', function() {
            console.log('mongodb disconnected');
            done();
        });
        connection.close();
    });
};