// var mongoClient = require('mongodb').MongoClient;
// var log = require('../log/log.js').getLog(__filename);

// /*
//  * Initialize a connection to the mongo database and export the db variable
//  * so that every next time somebody requires this module, the db variable will
//  & be accessible via the require('mongodb').db command.
//  *
//  * Call this method only once.
//  */
// module.exports.init = function(p_url, p_callback) {
//     log.debug('attempting to establish connection to mongodb', p_url);
//     mongoClient.connect(p_url, function(err, db) {
//         if (err) {
//             log.error('an error ocurred while trying to connect to', p_url,
//                 err);
//             p_callback(err, null);
//             return;
//         }

//         log.debug('successfully connected to ' + p_url);

//         module.exports.db = db;

//         p_callback(err);
//     });
// };