import to from 'await-to-js'
import moment from 'moment'
import { logger } from '../../lib'
import { slugify } from '../services'
import { user, article, flames, screenshot } from '../../models'

const pageNum = 10
const logHead = `[Flames] `
export default {
  /**
   * 評論管理
   * @param {*} req
   * @param {*} res
   */
  async add (req, res) {
    const { body } = req
    const { user, time, articleSlug, content, screenshot: sc, subtitle } = body

    // 文章是否存在
    let [aErr, articleData] = await to(article.findOne({ slug: articleSlug }))
    if (aErr) {
      logger.error(`${logHead}Find err`, aErr)
      return res.json({ status: 500, message: '找不到該文章' })
    }

    // 新增評論
    let { _id } = articleData
    let [fErr, flamesData] = await to(flames.create({ user, time, content, screenshot: sc, subtitle, article: _id }))
    if (fErr || !flamesData) {
      logger.error(`${logHead}Find err`, fErr)
      return res.json({ status: 500, message: '建立評論失敗' })
    }

    let { id: fid } = flamesData
    let slug = slugify(['article', sc, fid])
    let [updErr] = await to(flames.updateOne({ id: fid }, { slug }))
    if (updErr) {
      logger.error(`${logHead}Find err`, updErr)
      return res.json({ status: 500, message: '更新評論失敗' })
    }

    let [scErr] = await to(screenshot.updateOne({ id: sc }, { $inc: { flamesCount: 1 } }))
    if (scErr) {
      logger.error(`${logHead}Find screenshot err`, scErr)
      return res.json({ status: 500, message: '更新截圖失敗' })
    }

    flamesData.slug = slug
    let result = {
      status: 200,
      message: 'ok',
      data: {
        flames: flamesData
      }
    }

    return res.json(result)
  },
  async find (req, res) {
    console.info(`Find flames`)
    const { query } = req
    const { i, time, articleSlug, flamesSlug, imgId, flamesId, page } = query
    let flamesQuery = {}
    let totalPage = 1
    let currentPage = page || 1

    // 用截圖來搜尋評論的流程會不太一樣
    if (imgId) {
      let [imgErr, imgData] = await to(screenshot.findOne({ id: imgId }))
      if (imgErr || !imgData) {
        logger.error(`${logHead}Find err`, imgErr)
        return res.json({ status: 500, message: '找不到該截圖' })
      }
      flamesQuery.screenshot = imgData._id
    }

    // 把該文章的評論拉出來
    if (articleSlug) {
      let [aErr, articleData] = await to(article.findOne({ slug: articleSlug }))
      if (aErr) {
        logger.error(`${logHead}Find err`, aErr)
        return res.json({ status: 500, message: '找不到該文章' })
      }
      flamesQuery.article = articleData._id
    }

    if (i) {
      let reg = { $regex: `${i}`, $options: 'i' }
      flamesQuery.$or = [
        { title: reg }
      ]
    }

    if (time) {
      const before = moment().add(-1, 'h').valueOf()
      const after = moment().valueOf()
      flamesQuery.updatedAt = {
        $gte: before,
        $lte: after
      }
    }

    if (flamesSlug) flamesQuery.slug = flamesSlug
    if (flamesId) flamesQuery.id = flamesId

    let pageCount = (page - 1) * pageNum
    let [findErr, flamesData] = await to(flames.find(flamesQuery)
      .populate({
        path: 'screenshot',
        select: 'id time'
      })
      .populate({
        path: 'article',
        select: 'slug title'
      })
      .populate({
        path: 'user',
        select: 'name'
      })
      .skip(pageCount).sort('desc')
    )

    if (findErr) {
      logger.error(`${logHead}Find err`, findErr)
      return res.json({ status: 500, message: '搜尋評論錯誤' })
    }

    if (!flamesData) {
      logger.error(`${logHead}Find err`, findErr)
      return res.json({ status: 200, message: '找不到評論' })
    }

    let [countErr, flamesCount] = await to(flames.countDocuments(flamesQuery))
    if (countErr) {
      logger.error(`${logHead}Find err`, countErr)
      return res.json({ status: 500, message: '搜尋評論錯誤' })
    }

    totalPage = Math.ceil(flamesCount / pageNum) || 1
    for (let f of flamesData) {
      f.user = f.user.name
      // f.article = f.article.url
      // f.screenshot = f.screenshot.name
    }
    let result = {
      status: 200,
      message: 'ok',
      data: { totalPage, currentPage, flames: flamesData }
    }
    console.log(JSON.stringify(result))

    return res.json(result)
  },
  async update (req, res) {
    let { body } = req
    let { id, title, subtitle, content, time } = body
    console.log(JSON.stringify(body))

    // Find article
    let [findAErr, articleData] = await to(article.findOne({ id }))
    if (findAErr || !articleData) {
      logger.error(`${logHead}Find err`, findAErr)
      return res.json({ status: 500, message: '找不到文章' })
    }

    let flamesUpdate = { title, subtitle, content, time }
    let aKeys = Object.keys(flamesUpdate)
    for (let k of aKeys) {
      if (flamesUpdate[k] === null || flamesUpdate[k] === undefined) {
        delete flamesUpdate[k]
      }
    }

    let [articleErr] = await to(flames.updateOne({ id: articleData._id }, flamesUpdate))
    if (articleErr || !articleData) {
      logger.error(`${logHead}Find err`, articleErr)
      return res.json({ status: 500, message: '更新評論失敗' })
    }

    let result = {
      status: 200,
      message: 'ok'
    }

    return res.json(result)
  },
  async delete (req, res) {
    const { params } = req
    const { id } = params

    // Check permission
    let [findUErr, userData] = await to(user.findOne({ id: req.user.id }))
    if (findUErr || !userData) {
      logger.error(`${logHead}Find err`, findUErr)
      return res.json({ status: 500, message: '找不到該使用者' })
    }

    if (userData.permission !== 'Administrator') return res.json({ status: 500, message: '權限不足' })

    let [dfErr] = await to(flames.deleteOne({ id }))
    if (dfErr) {
      logger.error(`${logHead}Delete err`, dfErr)
      return res.json({ status: 500, message: '找不到該評論' })
    }

    let result = {
      status: 200,
      message: 'ok'
    }

    return res.json(result)
  },
  async findOne (req, res) {
    const { params, query } = req
    const { page } = query
    const { id } = params
    console.info(`Find flames by article id: ${id}`)

    // 這個api跟上面的find有點像，再討論要不要合併
    let [aErr, articleData] = await to(article.findOne({ id }))
    if (aErr || !articleData) {
      logger.error(`${logHead}Find article err`, aErr)
      return res.json({ status: 500, message: '找不到該文章' })
    }

    let totalPage = 1
    let currentPage = page || 1
    let { _id: articleId } = articleData
    let flamesQuery = { article: articleId }
    let pageCount = (page - 1) * pageNum
    let [findErr, flamesData] = await to(flames.find(flamesQuery)
      .populate({
        path: 'user',
        select: 'name'
      })
      .skip(pageCount).sort('desc')
    )
    if (findErr || !flamesData) {
      logger.error(`${logHead}Find err`, findErr)
      return res.json({ status: 500, message: '找不到該評論' })
    }

    let [countErr, flamesCount] = await to(flames.countDocuments(flamesQuery))
    if (countErr) {
      logger.error(`${logHead}Find err`, countErr)
      return res.json({ status: 500, message: '搜尋評論錯誤' })
    }

    totalPage = Math.ceil(flamesCount / pageNum) || 1
    for (let f of flamesData) {
      f.user = f.user.name
    }

    let result = {
      status: 200,
      message: 'ok',
      data: { flames: flamesData, totalPage, currentPage }
    }

    return res.json(result)
  }
}
