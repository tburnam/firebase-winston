const winston = require('winston');
const util = require('util');

exports = module.exports = FirebaseLogger = winston.transports.FirebaseLogger = function (options) {
  this.name = options.name || 'FirebaseLogger';
  this.level = options.level || 'silly';
  this.ref = options.ref || 'logs';
  this.key = options.key;
};

util.inherits(FirebaseLogger, winston.Transport);

FirebaseLogger.prototype.log = function (level, msg, meta, callback) {
  const key = meta[this.key] || Date.now();

  this.ref.update({
    [key]: {
      level,
      message: msg,
      timestamp: Date.now(),
      file: meta.file || '',
      action: meta.action || '',
      id: meta.id || '',
    },
  }, (error) => {
    if (error) {
      callback(error);
    } else {
      callback(null, true);
    }
  });
};
