var mongoose = require('mongoose');
var oibValidator = require('../../validators/oib-validator.js');
var keygen = require('../../util/keygen.js');

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

// companySchema.index({'name': 1, 'shortId': 1}, {unique: true});

// companySchema.index({'name': 1}, {unique: true});
// companySchema.index({'name': 1}, {unique: true});

// companySchema.set('autoIndex', true);

// companySchema.pre('save', function(next) {
//     debugger;
//     console.log("blaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
//     this.shortId = keygen.generate(this.name);
//     next();
// });
//

// companySchema.set('autoIndex', falsea);
var Company = mongoose.model('Company', companySchema);

// Company.schema.path('oib').validate(function(value) {
//     return oibValidator.validate(value);
// }, 'error.company.oib.invalid');

module.exports = mongoose.model('Company');
// module.exports = Company;