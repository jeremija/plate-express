var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var carInsurance = new Schema({
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
        }, 'error.invalid.car-insurance.name']
    },
    licensePlate: {
        type: String,
        uppercase: true,
        required: true,
        validate: [function(p_value) {
            // license plate must be in the form of
            // AB123C, AB123CD, AB1234C or AB1234CD
            return p_value.match(/^[A-Za-z]{2}[0-9]{3,4}[A-Za-z]{1,2}$/) ?
                true : false;
        }, 'error.invalid.car-insurance.licensePlate']
    },
    policyNumber: {
        type: String,
        required: true,
        validate: [function(p_value) {
            return p_value.match(/^[0-9]{12}$/) ? true : false;
        }, 'error.invalid.car-insurance.policyNumber']
    },
    expires: {
        type: Date,
        required: true,
    },
    power: {
        type: Number,
        required: true
    },
    maxAllowedMass: {
        type: Number
    },
    vehicleType: {
        type: String,
        required: true
    },
    company: {
        type: String,
        ref: 'Company',
        required: true
    }
});

// carInsurance.set('autoIndex', falsea);

var CarInsurance = mongoose.model('CarInsurance', carInsurance);

module.exports = mongoose.model('CarInsurance');
