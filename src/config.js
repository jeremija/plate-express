module.exports = {
    mongo: {
        url: 'mongodb://127.0.0.1:27017/plate-express'
    },
    log: {
        type: 'console-logger.js',
        level: 0
    },
    express: {
        publicFolders: [
            '/public'
        ],
        sessionSecret: '1174d307-8373-48ec-b35f-122631f7bd95',
        port: 8000
    }
};