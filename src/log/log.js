var config = require('../config.js');
var abstractLogger = require('./abstract-logger.js');

function getLoggerInstance(p_type) {
    var loggerInstance;
    try {
        loggerInstance = require('./' + p_type);
    }
    catch(err) {
        console.log('invalid config.log.type \'' + config.log.type + '\'' +
            ', using console-logger.js');
        loggerInstance = require('./console-logger.js');
    }
    return loggerInstance;
}

var loggerInstance = getLoggerInstance(config.log.type);

module.exports.getLog = function(p_logId) {
    return Object.create(abstractLogger, {
        logId: {
            value: p_logId,
            enumerable: true
        },
        level: {
            value: config.log.level,
            enumerable: true
        },
        loggerInstance: {
            value: loggerInstance,
            enumerable: true
        }
    });
};