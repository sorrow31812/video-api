import to from 'await-to-js'
import { logger } from '../../lib'
import { tag, user } from '../../models'

const logHead = `[Tag] `
export default {
  /**
   * 類別管理
   * @param {*} req
   * @param {*} res
   */
  async add (req, res) {
    const { body } = req
    const { name, enname, position, hide, special } = body

    // 類別是否已存在
    let checkQuery = { name, enname }
    let checkKeys = Object.keys(checkQuery)
    for (let k of checkKeys) {
      if (checkQuery[k] === null || checkQuery[k] === undefined) {
        delete checkQuery[k]
      }
    }
    let [tErr, tagData] = await to(tag.findOne(checkQuery))
    if (tErr || tagData) {
      logger.error(`${logHead}Find err`, tErr)
      return res.json({ status: 500, message: '該類別已存在' })
    }

    let [tagErr] = await to(tag.create({ name, enname, position, hide, special }))
    if (tagErr) {
      logger.error(`${logHead}Create err`, tagErr)
      return res.json({ status: 400, message: '新增類別錯誤' })
    }

    let result = {
      status: 200,
      message: 'ok'
    }

    return res.json(result)
  },
  async find (req, res) {
    console.info(`Find article`)
    const pageNum = 10
    const { query } = req
    const { page } = query
    let totalPage = 1
    let currentPage = page || 1

    let pageCount = (page - 1) * pageNum
    let [tagErr, tagData] = await to(tag.find().skip(pageCount).sort({ position: 1 }))
    if (tagErr || !tagData) {
      logger.error(`${logHead}Find err`, tagErr)
      return res.json({ status: 400, message: '找不到類別' })
    }

    let [countErr, tagCount] = await to(tag.countDocuments())
    if (countErr) {
      logger.error(`${logHead}Find err`, countErr)
      return res.json({ status: 500, message: '搜尋類別錯誤' })
    }

    totalPage = Math.ceil(tagCount / pageNum) || 1
    let result = {
      status: 200,
      message: 'ok',
      data: { totalPage, currentPage, tag: tagData }
    }

    console.log(JSON.stringify(result))

    return res.json(result)
  },
  async update (req, res) {
    let { body } = req
    let { id, name, enname, position, hide, special } = body

    // 類別是否已存在
    let [tErr, tagData] = await to(tag.findOne({ id }))
    if (tErr || !tagData) {
      logger.error(`${logHead}Find err`, tErr)
      return res.json({ status: 500, message: '該類別不存在' })
    }

    // Update tag
    let tagUpdate = { name, enname, position, hide, special }
    let tKeys = Object.keys(tagUpdate)
    for (let k of tKeys) {
      if (tagUpdate[k] === null || tagUpdate[k] === undefined) {
        delete tagUpdate[k]
      }
    }

    let [tagErr] = await to(tag.updateOne({ id }, tagUpdate))
    if (tagErr) {
      logger.error(`${logHead}Find err`, tagErr)
      return res.json({ status: 400, message: '更新類別失敗' })
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
      return res.json({ status: 400, message: '找不到該使用者' })
    }

    if (userData.permission !== 'Administrator') return res.json({ status: 400, message: '權限不足' })

    let [tagErr] = await to(tag.deleteOne({ id }))
    if (tagErr) {
      logger.error(`${logHead}Delete err`, tagErr)
      return res.json({ status: 400, message: '找不到該類別' })
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
    console.info(`Find tag: ${id}`)
    let [findErr, tagData] = await to(tag.findOne({ id }))
    if (findErr || !tagData) {
      logger.error(`${logHead}Find err`, findErr)
      return res.json({ status: 400, message: '找不到該類別' })
    }

    let result = {
      status: 200,
      message: 'ok',
      data: { tag: tagData }
    }

    return res.json(result)
  }
}
