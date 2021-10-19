import to from 'await-to-js'
import { logger } from '../../lib'
import moment from 'moment'
import { user, password } from '../../models'

const logHead = `[User] `
export default {
  /**
   * 使用者管理
   * @param {*} req
   * @param {*} res
   */
  async add (req, res) {
    const { body } = req
    const { name, password: p, social, email, permission } = body

    let [userErr, userData] = await to(user.create({ name, email, social, permission, hide: false, locale: 'zh-tw' }))
    if (userErr || !userData) {
      logger.error(`${logHead}create err`, userErr)
      return res.json({ status: 400, message: '建立帳號失敗' })
    }

    let [pwErr, pw] = await to(password.create({ user: userData._id, password: p, email }))
    if (pwErr || !pw) {
      logger.error(`${logHead}create err`, pwErr)
      return res.json({ status: 400, message: '建立密碼失敗' })
    }

    let result = {
      status: 200,
      message: 'ok'
    }

    return res.json(result)
  },
  async find (req, res) {
    console.info(`Find user`, JSON.stringify(req.query))
    const pageNum = 10
    const { query } = req
    const { i, page, createdAt, permission } = query
    let userQuery = {}
    let totalPage = 1
    let currentPage = page || 1

    if (permission) userQuery.permission = permission

    if (createdAt) {
      const timeStamp = moment(createdAt).valueOf()
      console.info(`${logHead}#49`, createdAt, timeStamp)
      userQuery.createdAt = {
        $lte: timeStamp
      }
    }

    if (i) {
      let reg = { $regex: `${i}`, $options: 'i' }
      userQuery.$or = [
        { name: reg }, { email: reg }
      ]
    }

    let pageCount = (page - 1) * pageNum
    let [findErr, users] = await to(user.find(userQuery).skip(pageCount).sort({ id: 1 }))
    if (findErr || !users) {
      logger.error(`${logHead}Find err`, findErr)
      return res.json({ status: 400, message: '找不到該使用者' })
    }

    let [countErr, userCount] = await to(user.countDocuments(userQuery))
    if (countErr) {
      logger.error(`${logHead}Find err`, countErr)
      return res.json({ status: 500, message: '搜尋使用者錯誤' })
    }

    totalPage = Math.ceil(userCount / pageNum) || 1
    let result = {
      status: 200,
      message: 'ok',
      data: { totalPage, currentPage, users }
    }

    // console.log(JSON.stringify(result))

    return res.json(result)
  },
  async update (req, res) {
    let { body } = req
    let { id, name, email, hide, social, permission } = body

    let updateData = { name, email, hide, social, permission }
    // remove null element
    let keys = Object.keys(updateData)
    for (let k of keys) {
      if (updateData[k] === null || updateData[k] === undefined) {
        delete updateData[k]
      }
    }

    let [userErr, userData] = await to(user.findOneAndUpdate({ id }, updateData))
    if (userErr || !userData) {
      logger.error(`${logHead}Find err`, userErr)
      return res.json({ status: 400, message: '更新帳號失敗' })
    }

    let result = {
      status: 200,
      message: 'ok'
    }

    return res.json(result)
  },
  async delete (req, res) {
    const { params, user: userInfo } = req
    const { data: { id: userId } } = userInfo
    const { id } = params

    // Check permission
    let [findUErr, userData] = await to(user.findOne({ id: userId }))
    if (findUErr || !userData) {
      logger.error(`${logHead}Find err`, findUErr)
      return res.json({ status: 500, message: '找不到該使用者' })
    }

    if (userData.permission !== 'Administrator') return res.json({ status: 500, message: '權限不足' })

    let [duErr] = await to(user.deleteOne({ id }))
    if (duErr) {
      logger.error(`${logHead}Delete err`, duErr)
      return res.json({ status: 400, message: '找不到該使用者' })
    }

    let [dpwErr] = await to(password.deleteOne({ id }))
    if (dpwErr) {
      logger.error(`${logHead}Delete err`, dpwErr)
      return res.json({ status: 400, message: '找不到該使用者' })
    }

    let result = {
      status: 200,
      message: 'ok'
    }

    return res.json(result)
  },
  async findOne (req, res) {
    const { params } = req
    const { id } = params
    console.info(`Find user: ${id}`)
    let [findErr, userData] = await to(user.findOne({ id }))
    if (findErr || !userData) {
      logger.error(`${logHead}Find err`, findErr)
      return res.json({ status: 400, message: '找不到該使用者' })
    }

    let result = {
      status: 200,
      message: 'ok',
      data: { user: userData }
    }

    return res.json(result)
  }
}
