import _ from 'lodash'
import fs from 'fs'
import path from 'path'
import moment from 'moment'
import { config as winstonConfig, transports } from 'winston'
import humps from 'humps'
import validator from 'validator'

const logPath = process.env.LOG_DIR
if (logPath && !fs.existsSync(logPath)) {
  fs.mkdirSync(logPath)
}

let formatter = (options) => {
  let { message, meta, timestamp, level } = options
  let printout = `[${level.toUpperCase()} ${timestamp()}] ${message} ${meta && _.keys(meta).length ? '\n\t' + JSON.stringify(meta) : ''}`
  return winstonConfig.colorize(level, printout)
}

let loggerTransports = [
  new transports.Console({
    timestamp () {
      const offset = moment().utcOffset()
      return moment().utcOffset(offset).format('YYYY-MM-DD HH:mm:ss.SSS')
    },
    formatter
  })
]

if (logPath) {
  // @ts-ignore
  loggerTransports = [
    ...loggerTransports,
    new transports.File({
      name: 'file.combined',
      filename: path.resolve(logPath, 'combined.log'),
      maxsize: 100 * 1024 * 1024,
      maxFiles: 20
    }),
    new transports.File({
      name: 'file.error',
      filename: path.resolve(logPath, 'error.log'),
      level: 'error',
      maxsize: 100 * 1024 * 1024,
      maxFiles: 10
    }),
    new transports.File({
      name: 'file.info',
      filename: path.resolve(logPath, 'info.log'),
      level: 'info',
      maxsize: 100 * 1024 * 1024,
      maxFiles: 10
    }),
    new transports.File({
      name: 'file.debug',
      filename: path.resolve(logPath, 'debug.log'),
      level: 'debug',
      maxsize: 100 * 1024 * 1024,
      maxFiles: 10
    })
  ]
}

function transformConfig (options) {
  let newConf = {}
  const numreg = /^-?[0-9.]+$/
  for (let key in options) {
    let val = options[key]
    key = humps.camelize(key.toLowerCase())
    if (numreg.test(val)) {
      val *= 1
    } else if (val === 'true' || val === '1') {
      val = true
    } else if (validator.isJSON(val)) {
      val = JSON.parse(val)
    } else if (_.isString(val)) {
      if (/,/g.test(val)) {
        val = val.split(',')
        val = val.map(v => {
          return numreg.test(v) ? v * 1 : v
        })
      }
    }
    newConf[key] = val
  }
  return newConf
}

let config = transformConfig(process.env)

function reloadConfig (configs) {
  configs = transformConfig(configs)
  config = {
    ...config,
    ...configs
  }
}

config = {
  ...config,
  redis: [{
    host: process.env.REDIS_CLIENT_HOST,
    port: process.env.REDIS_CLIENT_PORT,
    name: 'default'
  }],
  winston: {
    level: process.env.LOG_LEVEL || 'debug',
    exitOnError: false,
    transports: loggerTransports
  },
  appName: process.env.APP_NAME,
  reloadConfig,
  getConfigs () {
    return config
  },
  // @ts-ignore
  get configs () {
    return config
  }
}

_.each(config, (val, key) => {
  exports[key] = val
})

export default config
