module.exports.generate = function(p_name) {
    var name = (p_name && p_name.length > 0) ? p_name.toString() : 'undefined';
    name = name.replace(/[^a-zA-Z0-9]/g, '').substring(0, 10);
    while(name.length < 5) {
        var lastchar = name[name.length - 1];
        name += lastchar ? lastchar : '_';
    }

    // create a random hex key in the form of 'a0e'
    var random = Math.floor(Math.random()*4095).toString(16);
    while(random.length < 3) {
        // prepend with zeroes until length is 3 hex digits
        random = '0' + random;
    }

    // get timestamp in hex code
    var timestamp = new Date().getTime().toString(16);
    // takey the last 3 hex digits of timestamp
    timestamp = timestamp.substring(timestamp.length - 3, timestamp.length);

    return name + '-' + random + timestamp;
};