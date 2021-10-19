import { port, mongoHost, apiPrefix, winston, mongoPooling, defaultLocale, systemLocales, loginExpiredIn } from 'config'
import { logger, crypto, jwt } from './lib'
import express from 'express'
import http from 'http'
// import cors from 'cors'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
// import to from 'await-to-js'
import _ from 'lodash'
import fs from 'fs'
import { mongoose } from './models'
import multer from 'multer'
import i18n from 'i18n'
import routers from 'routers'
import path from 'path'
import fakeData from './fakeData'

const start = async () => {
  const app = express()

  logger.init(winston)

  // 初始化 redis
  // const redisSetting = {
  //   hosts: redisConfig,
  //   prefix: redisPrefix
  // }

  // await Redis.init(redisSetting)

  // 初始化 mongoose
  await mongoose.init({
    host: mongoHost,
    autoIndex: false,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    bufferCommands: false,
    poolSize: mongoPooling,
    autoReconnect: false
  })

  // 初始化 crypto
  const publicKey = fs.readFileSync(
    path.join(__dirname, '.ssh', 'public_key.pem')
  )
  const privateKey = fs.readFileSync(
    path.join(__dirname, '.ssh', 'private_key.pem')
  )
  crypto.init({
    publicKey,
    privateKey
  })

  jwt.init({
    publicKey,
    privateKey,
    expiredTime: loginExpiredIn
  })

  // 是否檢查 domain
  // let corsOptions = {}
  // if (checkCors === 1) {
  //   const { Operator } = models
  //   let [err, corsList] = await to(Operator.find({ actived: true }))
  //   if (err) {
  //     logger.error(`Get domain of operator error: ${err.message}`)
  //     process.exit()
  //   }
  //   corsList = corsList.map(w => w.domain)
  //   corsList = _.flatten(corsList)

  //   if (!corsList.length) {
  //     logger.warn(`No domain of operators.`)
  //     process.exit()
  //   }

  //   corsOptions = {
  //     origin: (origin, callback) => {
  //       if (corsList.includes(origin)) {
  //         callback(null, true)
  //       } else {
  //         callback(new Error('Not allowed by CORS'))
  //       }
  //     }
  //   }
  // }

  // app.use(cors(corsOptions))
  app.use(express.json({ limit: '5mb' }))
  app.use(multer().array())
  // app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(morgan('dev'))
  app.use(cookieParser())

  // 設定 i18n
  let locales = systemLocales || ['zh-tw', 'en']
  const directory = `${__dirname}/locales`
  fs.readdirSync(directory).forEach(file => {
    let key = file.replace(/\.json/, '')
    locales.push(key)
  })

  locales = _.uniq(locales)
  i18n.configure({
    locales,
    directory,
    defaultLocale,
    autoReload: true,
    syncFiles: true,
    register: global,
    objectNotation: true
  })

  app.use(i18n.init)

  // 設置 routers
  app.use(`/${apiPrefix || ''}`, routers())
  const server = http.createServer(app)

  server.listen(port, () => {
    logger.debug(`http server listen on port ${port}.`)
  })

  fakeData.init()
}

export default start
