var async = require('async');
var config = require('./config');
var mongooseConfig = require('./mongo/mongoose.js');
var log = require('./log/log.js').getLog(__filename);
var CarInsurance = require('./mongo/models/car-insurance');
var Company = require('./mongo/models/company');
var nodemailer = require('nodemailer');

// read the first argument (number of days)
var days = process.argv[2] || 14;

function daysToMillis(days) {
    return 1000 * 60 * 60 * 24 * days;
}

var dbConn;

function closeConncetion() {
    dbConn.close(function () {
        log.debug('closeConnection() db disconnected');
        process.exit(0);
    });
}

process.on('SIGINT', closeConncetion);

function generateEmailBody(cars) {
    var body = '<h1>Nekim vozilima uskoro istice osiguranje</h1>';
    body += "<p>Broj vozila: " + cars.length + '</p>';
    body += '<table>' +
        '<thead>' +
            '<th>Vozilo</th>' +
            '<th>Godina</th>' +
            '<th>Reg. oznaka</th>' +
            '<th>Broj police</th>' +
            '<th>Tvrtka</th>' +
            '<th>Skadenca</th>' +
        '</thead>' +
        '<tbody>';

    function addCell(text) {
        body += '<td>' + text + '</td>';
    }

    cars.forEach(function(car, index) {
        addCell(car.name);
        addCell(car.year);
        addCell(car.licensePlate);
        addCell(car.policyNumber);
        addCell(car.company ? car.company.name : car.company);

        var expires = car.expires;
        addCell(expires.getDate() + '.' +
            (expires.getMonth() + 1) + '.' + expires.getFullYear());
    });

    body += '</tbody>' +
        '</table>';

    return body;
}

// function sendMail(htmlBody, callback) {
//     log.debug('sendMail() opening smtp transport');
//     transport = nodemailer.createTransport('SMTP', {
//         service: 'Gmail',
//         auth: {
//             user: 'ac15cc1x@gmail.com',
//             pass: '1wd2ef3rg'
//         }
//     });

//     var mail = {
//         from: 'John Goodman <john@goodman.com>',
//         to: 'jerko.steiner@gmail.com',
//         subject: 'car insurances',
//         html: htmlBody
//     };

//     transport.sendMail(mail, function(err, response) {
//         log.debug('sendMail() closing smtp transport');
//         transport.close();
//         callback(err, response);
//     });
// }

function sendMail(htmlBody, callback) {
    console.log('htmlBody', htmlBody);
    callback(undefined, 'mail logged to output');
}

async.waterfall([
    function(callback) {
        mongooseConfig.init(config.mongo.url, callback);
    },
    function(conn, callback) {
        dbConn = conn;

        log.debug('db connection initiated');

        // because dates are stored in UTC format
        var dateFrom = new Date().setHours(-1, 0, 0, 0) + daysToMillis(days);
        var dateTo = new Date().setHours(22, 59, 59, 999) + daysToMillis(days);

        console.log('attempting to find cars from ' + new Date(dateFrom) + ' to ' + new Date(dateTo));

        CarInsurance.find({
            expires: {
                $gt: dateFrom,
                $lt: dateTo
                // $gt: Date.now(),
                // $lt: Date.now() + daysToMillis(14)
            }
        }).populate('company', 'name').exec(callback);
    },
    function(cars, callback) {
        if (!cars.length) {
            log.debug('no cars found, skipping email');
            callback(undefined, 'no mail sent because no cars were found');
            return;
        }
        log.debug('got cars:', cars);
        var body = generateEmailBody(cars);
        sendMail(body, callback);
    },
], function(err, response) {
    if (err) {
        log.error('an error has occurred!');
        throw err;
    }

    log.debug('process ended, response: ', response);
    log.debug('closing db connection...');
    closeConncetion();
});
