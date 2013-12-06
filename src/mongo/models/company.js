var mongoose = require('mongoose');
var oibValidator = require('../../validators/oib-validator.js');

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
    },
    carInsurances: [{
        type: Number,
        ref: 'CarInsurance'
    }]
});

// companySchema.set('autoIndex', falsea);

var Company = mongoose.model('Company', companySchema);

module.exports = mongoose.model('Company');
