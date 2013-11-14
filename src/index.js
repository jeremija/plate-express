var log = require('./log/log.js').getLog(__filename);

log.debug('calling startup script');

require('./startup.js').start();
