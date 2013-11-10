var mongo = require('./mongo/client.js');
var config = require('./config.js');
var log = require('./log/log.js').getLog(__filename);

log.debug('application starting');

mongo.init(config.mongo.url, function(err) {
});