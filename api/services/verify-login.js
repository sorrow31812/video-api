import { logger, jwt } from 'lib'
import to from 'await-to-js'
import _ from 'lodash'
import i18n from 'i18n'
import errors from 'errors'
import { isJWT, isJSON } from 'validator'

const logHead = `[services.verifyLogin] `
const verifyLogin = (eventName, socket, callback, playLogFunc) => async function (data, fn) {
  // 重置 socket timer
  if (_.isFunction(socket.resetTimer)) socket.resetTimer()
  if (_.isString(data) && isJSON(data)) data = JSON.parse(data)
  const { token } = data

  if (!token || !isJWT(token)) {
    logger.warn(`${logHead}#17 token not valid`)
    return fn(errors('40000003', 'verify-login-18'))
  }

  let [verr, authData] = await to(jwt.verify(token))
  if (verr) {
    logger.warn(`${logHead}#22`, verr)
    return fn(errors('40000003', 'verify-login-24'))
  }

  if (!authData) return fn(errors('40000003', 'verify-login-21'))
  const { data: user } = authData
  // eslint-disable-next-line no-unused-vars
  const { locale } = user
  i18n.setLocale(locale || 'zh-cn')

  data.eventName = eventName
  data.user = user

  logger.info(`${logHead}${socket.id} register event ${eventName}`)
  await callback(data, fn)
}

export default verifyLogin
