var Company = require('../mongo/models/company.js');

var generate = require('./generate');

generate.middleware(Company, '/companies');