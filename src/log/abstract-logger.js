/*
 * An abstract module for logging.
 * Expects to have set logDebug, logWarn and LogError methods
 */
function prependArgs(p_severity, p_logId, args) {
    args = Array.prototype.slice.call(args, 0);
    args.splice(0, 0, p_severity, p_logId + '>');
    return args;
}

function checkInstance(p_loggerInstance) {
    if (!p_loggerInstance) {
        throw new Error('loggerInstance not set. did you use the ' +
            'require(\'log.js\').getLog() function to get the logger?');
    }
}

module.exports = {
    logId: '',
    debug: function() {
        checkInstance(this.loggerInstance);
        if (this.level > 0) {
            return;
        }
        var args = prependArgs('DEBUG', this.logId, arguments);
        return this.loggerInstance.debug.apply(this, args);
    },
    warn: function() {
        checkInstance(this.loggerInstance);
        if (this.level > 1) {
            return;
        }
        var args = prependArgs('WARN ', this.logId, arguments);
        return this.loggerInstance.warn.apply(this, args);
    },
    error: function() {
        checkInstance(this.loggerInstance);
        if (this.level > 2) {
            return;
        }
        var args = prependArgs('ERROR', this.logId, arguments);
        return this.loggerInstance.error.apply(this, args);
    },
};