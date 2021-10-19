import { logger, jwt } from 'lib'
import { isJWT } from 'validator'
import i18n from 'i18n'
import to from 'await-to-js'

const logHead = '[verifyXtoken] '
// 驗證 X-Token, 用戶必需於 header 中夾帶 X-Token
const verifyXtoken = async (req, res, next) => {
  const { locale: reqLocale, __: $t, url } = req
  let xtoken = req.get('X-Token')
  console.log(`${reqLocale} / ${$t}`)

  // 修改密碼不用token驗證
  if (url === '/password') return next()

  if (!isJWT(xtoken)) {
    logger.warn(`${logHead}X-Token is invalid.`)
    // return res.status403()
  }

  let [verr, user] = await to(jwt.verify(xtoken))
  if (verr) {
    logger.error(`${logHead}Token verify failed.`)
    // return res.json({ status: 400, message: 'Token驗證失敗' })
  }

  const { locale } = user
  if (locale) i18n.setLocale(locale)
  req.user = user

  next()
}

export default verifyXtoken
