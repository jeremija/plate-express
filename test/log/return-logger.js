/*
 * This is a test logger which just returns the logged value
 */

function getStringFromArgs(args) {
    args = Array.prototype.slice.call(args, 0);
    var str = '';
    for (var i in args) {
        str += args[i] + ' ';
    }
    return str.trim();
}

module.exports = {
    type: 'return-logger',
    debug: function() {
        return getStringFromArgs(arguments);
    },
    warn: function() {
        return getStringFromArgs(arguments);
    },
    error: function() {
        return getStringFromArgs(arguments);
    }
};