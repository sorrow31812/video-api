import _ from 'lodash'
import to from 'await-to-js'
import config from '../../../config/configs.js'
import { jwt, logger } from 'lib'
import { user, password } from 'models'

const logHead = `[auth.email.signin] `
export default {
  /**
   * 綁定 facebook
   * @param {*} req - express req object
   * @param {*} res - express res object
   */
  async signin (req, res) {
    logger.info(`${logHead}User sign in`)
    const { tokenExpiredTime } = config.getConfigs()
    const { body } = req
    let { name, password: p, social, email } = body

    // 使用者是否存在
    let [findErr, userData] = await to(user.findOne({ email }))
    if (findErr) {
      logger.error(`${logHead}Find err`, findErr)
      return res.json({ status: 400, message: '尋找使用者發生錯誤' })
    }

    if (userData) {
      // 使用者登入
      let { _id } = userData
      let [findPErr, pw] = await to(password.findOne({ user: _id }))
      if (findPErr) {
        logger.error(`${logHead}Find err`, findPErr)
        return res.json({ status: 400, message: '使用者登入發生錯誤' })
      }

      console.log(`${pw.password} / ${p}`)
      if (pw.password !== _.toString(p)) return res.json({ status: 400, message: '帳號或密碼錯誤' })
    } else {
      // 註冊
      let [userErr, newUserData] = await to(user.create({ name, email, social, hide: false, locale: 'zh-tw' }))
      if (userErr || !newUserData) {
        logger.error(`${logHead}create err`, userErr)
        return res.json({ status: 400, message: '建立帳號失敗' })
      }

      let [pwErr, pw] = await to(password.create({ user: newUserData._id, password: p, email }))
      if (pwErr || !pw) {
        logger.error(`${logHead}create err`, pwErr)
        return res.json({ status: 400, message: '建立密碼失敗' })
      }

      userData = newUserData
    }

    const [tkErr, token] = await to(jwt.sign(userData, tokenExpiredTime))
    if (tkErr) return res.json({ status: 400, message: '建立帳號失敗' })
    if (!token) {
      logger.debug(`${logHead}#125`)
      throw new Error('Sign in error')
    }

    return res.json({
      status: 200,
      message: 'ok',
      token,
      data: { user: userData }
    })
  }
}
