module.exports = {
    type: 'console',
    debug: function() {
        console.log.apply(console, arguments);
    },
    warn: function() {
        console.warn.apply(console, arguments);
    },
    error: function() {
        console.error.apply(console, arguments);
    }
};