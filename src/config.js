module.exports = {
    mongo: {
        url: "mongodb://127.0.0.1:27017/plate-express"
    },
    log: {
        type: 'console-logger.js',
        level: 0
    },
    express: {
        publicFolders: [
            '/public'
        ]
    }
};