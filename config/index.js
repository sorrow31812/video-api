
import myconfigs from './configs'

var termProgram = myconfigs.termProgram
var initCwd = myconfigs.initCwd
var term = myconfigs.term
var shell = myconfigs.shell
var tmpdir = myconfigs.tmpdir
var termProgramVersion = myconfigs.termProgramVersion
var user = myconfigs.user
var commandMode = myconfigs.commandMode
var sshAuthSock = myconfigs.sshAuthSock
var cfUserTextEncoding = myconfigs.cfUserTextEncoding
var path = myconfigs.path
var cfbundleidentifier = myconfigs.cfbundleidentifier
var pwd = myconfigs.pwd
var lang = myconfigs.lang
var xpcFlags = myconfigs.xpcFlags
var xpcServiceName = myconfigs.xpcServiceName
var shlvl = myconfigs.shlvl
var home = myconfigs.home
var logname = myconfigs.logname
var colorterm = myconfigs.colorterm
var appName = myconfigs.appName
var port = myconfigs.port
var externalPort = myconfigs.externalPort
var cluster = myconfigs.cluster
var logLevel = myconfigs.logLevel
var redisClientHost = myconfigs.redisClientHost
var redisClientPort = myconfigs.redisClientPort
var redisCacheTime = myconfigs.redisCacheTime
var mongoHost = myconfigs.mongoHost
var mongoPooling = myconfigs.mongoPooling
var apiHost = myconfigs.apiHost
var xOperatorId = myconfigs.xOperatorId
var requestLog = myconfigs.requestLog
var apiPrefix = myconfigs.apiPrefix
var enableOneTimeXToken = myconfigs.enableOneTimeXToken
var enableTest = myconfigs.enableTest
var pageSize = myconfigs.pageSize
var redisPrefix = myconfigs.redisPrefix
var redisUserLogedInPrefix = myconfigs.redisUserLogedInPrefix
var tokenExpiredTime = myconfigs.tokenExpiredTime
var defaultLocale = myconfigs.defaultLocale
var systemLocales = myconfigs.systemLocales
var developerAccounts = myconfigs.developerAccounts
var loginExpiredIn = myconfigs.loginExpiredIn
var googleServiceFile = myconfigs.googleServiceFile
var iapTest = myconfigs.iapTest
var iapVerbos = myconfigs.iapVerbos
var redis = myconfigs.redis
var winston = myconfigs.winston
var reloadConfig = myconfigs.reloadConfig
var getConfigs = myconfigs.getConfigs
var configs = myconfigs.configs

export { termProgram, initCwd, term, shell, tmpdir, termProgramVersion, user, commandMode, sshAuthSock, cfUserTextEncoding, path, cfbundleidentifier, pwd, lang, xpcFlags, xpcServiceName, shlvl, home, logname, colorterm, appName, port, externalPort, cluster, logLevel, redisClientHost, redisClientPort, redisCacheTime, mongoHost, mongoPooling, apiHost, xOperatorId, requestLog, apiPrefix, enableOneTimeXToken, enableTest, pageSize, redisPrefix, redisUserLogedInPrefix, tokenExpiredTime, defaultLocale, systemLocales, developerAccounts, loginExpiredIn, googleServiceFile, iapTest, iapVerbos, redis, winston, reloadConfig, getConfigs, configs }

const moduleList = {
  termProgram,
  initCwd,
  term,
  shell,
  tmpdir,
  termProgramVersion,
  user,
  commandMode,
  sshAuthSock,
  cfUserTextEncoding,
  path,
  cfbundleidentifier,
  pwd,
  lang,
  xpcFlags,
  xpcServiceName,
  shlvl,
  home,
  logname,
  colorterm,
  appName,
  port,
  externalPort,
  cluster,
  logLevel,
  redisClientHost,
  redisClientPort,
  redisCacheTime,
  mongoHost,
  mongoPooling,
  apiHost,
  xOperatorId,
  requestLog,
  apiPrefix,
  enableOneTimeXToken,
  enableTest,
  pageSize,
  redisPrefix,
  redisUserLogedInPrefix,
  tokenExpiredTime,
  defaultLocale,
  systemLocales,
  developerAccounts,
  loginExpiredIn,
  googleServiceFile,
  iapTest,
  iapVerbos,
  redis,
  winston,
  reloadConfig,
  getConfigs,
  configs
}

export default moduleList
