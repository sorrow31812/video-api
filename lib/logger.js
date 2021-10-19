const Logger = require('winston').Logger

let logger = null

const myLogger = {
  init (winstonConfig) {
    logger = new Logger(winstonConfig)
  },
  error: (...args) => logger.error(...args),
  info: (...args) => logger.info(...args),
  warn: (...args) => logger.warn(...args),
  debug: (...args) => logger.debug(...args)
}

module.exports = myLogger
