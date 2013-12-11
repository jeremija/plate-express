var util = require('util');

function RefError(key) {
    Error.call(this);
    Error.captureStackTrace(this, this.constructor);

    this.name = this.constructor.name;
    this.key = key;
}

util.inherits(RefError, Error);

module.exports = RefError;