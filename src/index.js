// var mongo = require('./mongo/client.js');
var mongoos
var config = require('./config.js');
var log = require('./log/log.js').getLog(__filename);

var appFactory = require('./app-factory.js');

log.debug('application starting');

// mongo.init(config.mongo.url, function(err) {
//     var app = appFactory.create(8080);
// });