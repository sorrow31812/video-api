import to from 'await-to-js'
import nodemailer from 'nodemailer'
import config from '../../config/configs.js'
import request from 'superagent'
import { jwt, logger } from '../../lib'
import { user, password } from '../../models'

const logHead = `[Password] `
export default {
  /**
   * 類別管理
   * @param {*} req
   * @param {*} res
   */
  async update (req, res) {
    let { body } = req
    let { password: p, token: t } = body

    // 驗證格式: 至少一個小寫字母、一個數字，且最少 5 個字元以上
    // if (!/^(?=.*[a-zA-Z])(?=.*\d).{5,}$/.test(p)) return res.json({ status: 400, message: '密碼格式不符' })
    // 需要被修改的使用者
    let [verr, vData] = await to(jwt.verify(t))
    if (verr) {
      logger.error(`${logHead}token 失效`, verr)
      return res.json({ status: 400, message: 'token 失效' })
    }

    const { data: { _id } } = vData
    let [pwErr, pw] = await to(password.findOneAndUpdate({ user: _id }, { password: p }))
    if (pwErr || !pw) {
      logger.error(`${logHead}Update password err`, pwErr)
      return res.json({ status: 500, message: '更新密碼失敗' })
    }

    let result = {
      status: 200,
      message: 'ok'
    }

    return res.json(result)
  },
  async sendEmail (req, res) {
    const tokenExpiredTime = 30 * 60 * 1000
    const { developerEmail, developerPw, resetPassword } = config.getConfigs()
    let { body } = req
    let { email } = body

    let [uErr, userData] = await to(user.findOne({ email }))
    if (uErr || !userData) {
      logger.error(`${logHead}Find user err`, uErr)
      return res.json({ status: 500, message: '找不到該使用者' })
    }

    const [tkErr, token] = await to(jwt.sign({ _id: userData._id }, tokenExpiredTime))
    if (tkErr || !token) return res.json({ status: 400, message: '修改密碼失敗' })

    let resetUrl = `${resetPassword}?t=${token}`
    let [sErr, resUrl] = await to(request
      .post('https://api.reurl.cc/shorten')
      .send(JSON.stringify({
        url: resetUrl
      }))
      .set('reurl-api-key', '4070ff49d794e33316573b663c974755ecd3b535979f04df8a38b58d65165567c4f5d6')
    )
    if (sErr) {
      logger.error(`${logHead}Get short url err`, sErr)
    }

    if (resUrl) resetUrl = resUrl.body.short_url

    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: developerEmail,
        pass: developerPw
      }
    })

    let mailOptions = {
      from: developerEmail,
      to: email,
      subject: '修改密碼確認信',
      text: `請於30分鐘內點擊此連結已修改密碼 \n ${resetUrl}`
    }

    let [tpErr, info] = await to(transporter.sendMail(mailOptions))
    if (tpErr) return res.json({ status: 400, message: '修改密碼失敗' })
    console.log(JSON.stringify(info))

    let result = {
      status: 200,
      message: 'ok'
    }

    return res.json(result)
  }
}
