function f(x) {
    var val = x % 10;
    return val === 0 ? 10 : val;
}

function verify(digits) {
    if (digits.length !== 11) {
        return false;
    }

    var checkDigit = parseInt(digits[digits.length - 1]);

    var t = 10;
    for(var i = 0; i < digits.length - 1; i++) {
        t = (2 * f(t + parseInt(digits[i]))) % 11;
    }

    return ((t + checkDigit) % 10) === 1;
}

module.exports.validate = function(p_oib) {
    if (typeof p_oib !== 'string') {
        return false;
    }
    return verify(p_oib + '');
};