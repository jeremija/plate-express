describe(__filename, function() {
    var logonHelper = require('../_helper/logon-helper.js');
    var mongoose = require('mongoose');
    var keygen = require('../../src/util/keygen.js');

    var plain = [];
    var documents = [];
    it('should populate initial data', function(done) {
        var Model = mongoose.model('Company');

        var modelNames = ['model1', 'model2', 'model3'];
        modelNames.forEach(function(name) {
            plain.push({
                name: name,
                shortId: keygen.generate(name),
            });
        });
        plain[0].oib = '38065658119';
        plain[1].oib = '43889476057';
        plain[2].oib = '52721853252';

        Model.create(plain, function(err) {
            if (err) {
                done(err);
                return;
            }

            documents = [].slice.call(arguments, 1);
            done();
        });
    });


    after(function(done) {
        var i = documents.length;

        function handler(err) {
            if (err) {
                throw err;
            }
            i--;
            if (i === 0) {
                done();
            }
        }

        for(var j in documents) {
            var doc = documents[j];
            doc.remove(handler);
        }
    });

    describe('GET /companies/get/{id}', function(done) {
        it('should have content type json', function(done) {
            request(app)
                .get('/companies/get/' + plain[0].shortId)
                .set('cookie', logonHelper.sessionCookie)
                .expect('Content-Type', /json/)
                // .expect(/^\{\s*?\}$/m)
                .expect(new RegExp('"shortId": *?"' + documents[0].shortId + '"'))
                .expect(new RegExp('"name": *?"' + documents[0].name + '"'))
                .end(function(err, res) {
                    expect(res.body.error).to.not.be.ok();
                    done(err);
                });
        });
        it('should return null on non existing id', function(done) {
            request(app)
                .get('/companies/get/non-existing-id')
                .set('cookie', logonHelper.sessionCookie)
                .expect('Content-Type', /json/)
                .end(function(err, res) {
                    expect(res.body.error).to.not.be.ok();
                    done(err);
                });
        });
    });

    describe('GET /companies/find', function() {
        it('should find all companies', function(done) {
            request(app)
                .get('/companies/find')
                .set('cookie', logonHelper.sessionCookie)
                .expect('Content-Type', /json/)
                // .expect(//)
                .end(function(err, res) {
                    expect(res.body && res.body.data).to.be.ok();
                    expect(res.body.data.length >= 3).to.be.ok();
                    done(err);
                });
        });
        it('should find filtered company', function(done) {
            request(app)
                .get('/companies/find?shortId=' + plain[0].shortId)
                .set('cookie', logonHelper.sessionCookie)
                .expect('Content-Type', /json/)
                .end(function(err, res) {
                    expect(res.body.error).to.not.be.ok();
                    expect(res.body.data.length).to.be(1);
                    done(err);
                });
        });
    });

    var shortId;
    describe('POST /companies/save', function() {
        var insertedCompany;
        it('should save company', function(done) {
            request(app)
                .post('/companies/save')
                .send({
                    name: 'a-compan23',
                    oib: '17778321663'
                })
                .set('cookie', logonHelper.sessionCookie)
                .expect('Content-Type', /json/)
                .end(function(err, res) {
                    if (err) done(err);
                    expect(res.body.error).to.not.be.ok();
                    expect(res.body.data).to.be.ok();
                    expect(res.body.data.shortId)
                        .to.match(/acompan23-[a-z0-9]{6}/);
                    insertedCompany = res.body.data;
                    shortId = insertedCompany.shortId;
                    done();
                });
        });
        it('should fail to insert duplicate company', function(done) {
            request(app)
                .post('/companies/save')
                .send({
                    name: 'a-compan24',
                    oib: '17778321663'
                })
                .set('cookie', logonHelper.sessionCookie)
                .expect('Content-Type', /json/)
                .end(function(err, res) {
                    if (err) done(err);
                    expect(res.body.error).to.be.ok();
                    expect(res.body.error.message).to.be('error.db.duplicate');
                    expect(res.body.data).to.not.be.ok();
                    done();
                });
        });
        it('should update company', function(done) {
            request(app)
                .post('/companies/save')
                .send({
                    shortId: shortId,
                    name: 'a-compan20'
                })
                .set('cookie', logonHelper.sessionCookie)
                .expect('Content-Type', /json/)
                .end(function(err, res) {
                    if (err) done(err);
                    expect(res.body.error).to.not.be.ok();
                    expect(res.body.data).to.be.ok();
                    expect(res.body.data.shortId).to.be(shortId);
                    expect(res.body.data.name).to.be('a-compan20');
                    done();
                });
        });
    });

    describe('POST /companies/delete', function() {
        it('should delete the inserted company', function(done) {
            request(app)
                .post('/companies/delete')
                .send({
                    shortId: shortId
                })
                .set('cookie', logonHelper.sessionCookie)
                .expect('Content-Type', /json/)
                .end(function(err, res) {
                    if (err) done(err);
                    expect(res.body.error).to.not.be.ok();
                    expect(res.body.data).to.be.ok();
                    expect(res.body.data.shortId).to.be(shortId);
                    done();
                });
        });
    });


    // describe('POST /companies/save', function(done) {
    //     it('should insert new data data', function() {

    //     });
    //     it('should update the existing data', function() {

    //     });
    // });

    // describe('POST /companies/remove', function(done) {
    //     it('should remove the data', function() {

    //     });
    //     it('should remove multiple data if multiple keys', function() {

    //     });
    // });

});