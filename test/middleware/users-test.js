describe(__filename, function() {

    describe('GET /users/list', function(done) {
        it('should have content type json', function(done) {
            request(app).
                get('/users/list').
                expect('Content-Type', /json/).
                //expect(/^\[\s*?\]$/m).
                expect(/firstName": *?"John"/).
                expect(/john@travolta\.com/).
                end(function(err, res) {
                    done(err);
                });
        });
    });
});