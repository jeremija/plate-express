module.exports = {
    mongo: {
        url: 'mongodb://127.0.0.1:27017/plate-express',
        // debug: true,
        // autoIndex: true
    },
    log: {
        type: 'console-logger.js',
        level: 0
    },
    express: {
        publicFolders: [
            '/www-src',
            // '/www-dist'
        ],
        // privateFolders: [
        //     '/www-private'
        // ],
        sessionSecret: '1174d307-8373-48ec-b35f-122631f7bd95',
        sessionSecure: false,
        port: 8000,
        securePort: 8443,
        cert: 'server',
        https: false,
        http: true
    },
    dirname: __dirname
};