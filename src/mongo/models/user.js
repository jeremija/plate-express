var mongoose = require('mongoose');
var crypto = require('crypto');
var uuid = require('node-uuid');

var Schema = mongoose.Schema;

var userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        index: {
            unique: true
        },
        validate: [function(p_value) {
            if (!p_value) return false;
            return p_value.match(/^[a-zA-Z0-9\.!#$%&'*+-\/=?^_`{|}~]*?@[a-zA-Z0-9\.].*$/) ?
                true : false;
        }, 'error.invalid.email']
    },
    salt: {
        type: String,
        required: true,
        default: uuid.v1
    },
    passwordHash: {
        type: String,
        required: true
    },
    enabled: {
        type: Boolean,
        required: true
    }
});

var hash = function(p_password, p_salt) {
    return crypto.createHmac('sha256', p_salt).update(p_password).digest('hex');
};

userSchema.methods.setPassword = function(p_password) {
    this.passwordHash = hash(p_password, this.salt);
};

userSchema.methods.isPasswordValid = function(p_password) {
    return this.passwordHash === hash(p_password, this.salt);
};

if (!userSchema.options.toObject) userSchema.options.toObject = {};
userSchema.options.toObject.transform = function(doc, ret, options) {
    delete ret._id;
    delete ret.salt;
    delete ret.passwordHash;
};

mongoose.model('User', userSchema);

module.exports = mongoose.model('User');