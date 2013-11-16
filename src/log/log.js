var config = require('../config.js');
var abstractLogger = require('./abstract-logger.js');

function getLoggerInstance(p_type) {
    var loggerInstance;
    try {
        loggerInstance = require('./' + p_type);
    }
    catch(err) {
        // console.log('invalid config.log.type \'' + config.log.type + '\'' +
        //     ', using console-logger.js');
        loggerInstance = require('./console-logger.js');
        loggerInstance.warn(err.message + ', using console-logger.js');
    }
    return loggerInstance;
}

/**
 * Gets the logger with the specified log identificator
 * @param  String p_logId the identificator of the log
 * @return {[type]}
 */
module.exports.getLog = function(p_logId) {
    p_logId = p_logId || '(undefined)';
    var loggerInstance = getLoggerInstance(config.log.type);

    return Object.create(abstractLogger, {
        logId: {
            value: p_logId.replace(config.dirname, ''),
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