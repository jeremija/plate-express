describe(__filename, function() {
    var keygen = require('../../src/util/keygen.js');

    it('should generate keys with minimum length of 9', function() {
        var key1 = keygen.generate('test1');
        expect(key1).to.match(/test1-[0-9a-f]{6}/);

        var key2 = keygen.generate('test1');
        expect(key2).to.match(/test1-[0-9a-f]{6}/);

        expect(key1).to.not.be(key2);
    });
    it('should delete non-numbers and non-characters', function() {
        var key1 = keygen.generate('a com?123*');
        expect(key1).to.match(/acom123-[0-9a-f]{6}/);
    });
    it('should generate keys with a maximum length of 17', function() {
        var key1 = keygen.generate('a long company\'s name');
        expect(key1).to.match(/alongcompa-[0-9a-f]{6}/);
    });
    it('should append last character if name is too short', function() {
        var key = keygen.generate('abc');
        expect(key).to.match(/abccc-[0-9a-f]{6}/);

        key = keygen.generate();
        expect(key).to.match(/undefined-[0-9a-f]{6}/);

        key = keygen.generate('');
        expect(key).to.match(/undefined-[0-9a-f]{6}/);

        key = keygen.generate('a');
        expect(key).to.match(/aaaaa-[0-9a-f]{6}/);
    });
});