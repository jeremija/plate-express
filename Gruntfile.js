module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js', '!src/public/**/*'],
        },
        // jsdoc : {
        //     dist : {
        //         src: ['src/**/*.js'],
        //         options: {
        //             destination: 'doc'
        //         }
        //     }
        // },
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec'
                },
                src: ['test/test.js']
            }
        },
        watch: {
            files: ['<%= jshint.files %>'],
            tasks: ['jshint', 'mocha']
        },
    });

    grunt.registerTask('start', 'start application', function() {
        var done = this.async();
        require('./src/index.js');
        // do not call done() to make the server keep running
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-mocha-test');
    // grunt.loadNpmTasks('grunt-jsdoc');

    grunt.registerTask('test', ['jshint', 'mochaTest']);
    // grunt.registerTask('doc', ['jshint', 'mochaTest', 'jsdoc']);
    grunt.registerTask('default', ['jshint', 'mochaTest']);
};