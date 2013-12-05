var mongoose = require('mongoose');
var oibValidator = require('./src/validators/oib-validator.js');

mongoose.set('debug', true);

mongoose.connect('mongodb://127.0.0.1:27017/plate-express');
var conn = mongoose.connection;

conn.on('error', function(err) {
    throw err;
});

var Schema = mongoose.Schema;

var companySchema = new Schema({
    shortId: {
        type: String,
        required: true,
        index: {
            unique: true
        }
    },
    name: {
        type: String,
        required: true,
        index: {
            unique: true
        },
        validate: [function(p_value) {
            return typeof p_value === 'string' && p_value.length > 1;
        }, 'error.invalid.company.name']
    },
    oib: {
        type: String,
        required: true,
        index: {
            unique: true
        },
        validate: [oibValidator.validate, 'error.invalid.company.oib']
    }
});

mongoose.model('Company', companySchema);

setTimeout(function() {
    console.log('end');
}, 5000);