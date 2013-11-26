module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
        },
        // jsdoc : {
        //     dist : {
        //         src: ['src/**/*.js'],
        //         options: {
        //             destination: 'doc'
        //         }
        //     }
        // },
        watch: {
            files: ['<%= jshint.files %>'],
            tasks: ['jshint', 'mocha']
        },
    });

    grunt.registerTask('mocha', 'run mocha tests', function() {
        var done = this.async();
        require('child_process').exec('./node_modules/.bin/mocha ./test/test.js',
            function(err, stdout) {
                grunt.log.write(stdout);
                done(err);
            });
    });

    grunt.registerTask('start', 'start application', function() {
        var done = this.async();
        require('./src/index.js');
        // do not call done so you havo to terminate manually
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    // grunt.loadNpmTasks('grunt-jsdoc');

    grunt.registerTask('test', ['jshint', 'mocha']);
    // grunt.registerTask('doc', ['jshint', 'mochaTest', 'jsdoc']);
    grunt.registerTask('default', ['jshint', 'mocha']);
};