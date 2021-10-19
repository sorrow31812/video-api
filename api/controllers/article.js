import to from 'await-to-js'
import { logger } from '../../lib'
import { slugify } from '../services'
import { article, flames, video, user, tag as Tag } from '../../models'

const logHead = `[Article] `
export default {
  /**
   * 文章管理
   * @param {*} req
   * @param {*} res
   */
  async add (req, res) {
    const { body } = req
    // user是使用者ID
    const { user: uid, title, chMaster, chMasterGender, content, video: vUrl, source, tag: tid, attribute } = body

    // 影片是否已存在
    let [vdErr, videoData] = await to(video.findOne({ url: vUrl }))
    if (vdErr) {
      logger.error(`${logHead}Find err`, vdErr)
      return res.json({ status: 500, message: '尋找影片錯誤' })
    }

    if (!videoData) {
      let [vdCErr, newVideoData] = await to(video.create({ url: vUrl, source }))
      if (vdCErr) {
        logger.error(`${logHead}Create err`, vdCErr)
        return res.json({ status: 500, message: '新增影片錯誤' })
      }
      videoData = newVideoData
    }

    // 類別是否已存在
    let [tErr, tagData] = await to(Tag.findOne({ id: tid }))
    if (tErr || !tagData) {
      logger.error(`${logHead}Find err`, tErr)
      return res.json({ status: 500, message: '尋找類別錯誤' })
    }

    let [uErr, userData] = await to(user.findOne({ id: uid }))
    if (uErr || !userData) {
      logger.error(`${logHead}Find err`, uErr)
      return res.json({ status: 500, message: '找不到該使用者' })
    }

    // 新增文章
    // attribute目前有live(直播)、film(影片)
    let { _id, id: vid } = videoData
    let [articleErr, articleData] = await to(article.create({ user: userData._id, title, chMaster, chMasterGender, content, video: _id, tag: tagData._id, attribute, slug: ' ' }))
    if (articleErr || !articleData) {
      logger.error(`${logHead}Find err`, articleErr)
      return res.json({ status: 500, message: '建立文章失敗' })
    }

    let { id: aid } = articleData
    let slug = slugify(['article', vid, aid])
    let [updErr] = await to(article.updateOne({ id: aid }, { slug }))
    if (updErr) {
      logger.error(`${logHead}Find err`, updErr)
      return res.json({ status: 500, message: '更新文章失敗' })
    }

    articleData.slug = slug
    let result = {
      status: 200,
      message: 'ok',
      data: {
        article: articleData
      }
    }

    return res.json(result)
  },
  async find (req, res) {
    console.info(`Find article`)
    const pageNum = 10
    const { query } = req
    const { i, tag: tagId, page, source, attribute } = query
    let articleQuery = {}
    let totalPage = 1
    let currentPage = page || 1

    if (i) {
      let reg = { $regex: `${i}`, $options: 'i' }
      articleQuery.$or = [
        { title: reg }, { userName: reg }, { chMaster: reg }
      ]
    }

    // Find tag
    if (tagId) {
      let [tErr, tagData] = await to(Tag.findOne({ id: tagId }))
      if (tErr) return res.json({ status: 500, message: '取得類別失敗' })
      articleQuery.tag = tagData._id
    }

    if (source) articleQuery.source = source
    if (attribute) articleQuery.attribute = attribute

    let pageCount = (page - 1) * pageNum
    // console.log(JSON.stringify(articleQuery))
    let [findErr, articles] = await to(article.find(articleQuery)
      .populate('user', 'name')
      .populate('video', '_id url source')
      .populate('tag', 'id name')
      .skip(pageCount).sort('desc')
    )
    if (findErr) {
      logger.error(`${logHead}Find err`, findErr)
      return res.json({ status: 500, message: '搜尋文章錯誤' })
    }

    if (!articles) {
      logger.error(`${logHead}Find err`, findErr)
      return res.json({ status: 200, message: '找不到文章' })
    }

    let [countErr, articlesCount] = await to(article.countDocuments(articleQuery))
    if (countErr) {
      logger.error(`${logHead}Find err`, countErr)
      return res.json({ status: 500, message: '搜尋文章錯誤' })
    }

    totalPage = Math.ceil(articlesCount / pageNum) || 1
    // 深層複製，使用lodash沒效果，所以用這方式。
    articles = JSON.parse(JSON.stringify(articles))

    for (let a of articles) {
      a.tagId = a.tag ? a.tag.id : null
      a.tag = a.tag ? a.tag.name : null
      a.source = a.video.source
      a.video = a.video.url
      a.videoId = a.video._id
      a.name = a.user ? a.user.name : null
      delete a.user
    }
    let result = {
      status: 200,
      message: 'ok',
      data: { totalPage, currentPage, article: articles }
    }

    console.log(JSON.stringify(result))

    return res.json(result)
  },
  async update (req, res) {
    let { body } = req
    let { id, title, video: url, tag, attribute, source, chMaster, chMasterGender, content } = body
    console.log(JSON.stringify(body))

    let [tagErr, tagRes] = await to(Tag.findOne({ id: tag }))
    if (tagErr) {
      logger.error(`${logHead}Find err`, tagErr)
      return res.json({ status: 500, message: '找不到類別' })
    }

    // Update article
    let articleUpdate = { title, tag: tagRes._id, attribute, chMaster, chMasterGender, content }
    let aKeys = Object.keys(articleUpdate)
    for (let k of aKeys) {
      if (articleUpdate[k] === null || articleUpdate[k] === undefined) {
        delete articleUpdate[k]
      }
    }

    let [articleErr, articleData] = await to(article.findOneAndUpdate({ id }, articleUpdate))
    if (articleErr || !articleData) {
      logger.error(`${logHead}Find err`, articleErr)
      return res.json({ status: 500, message: '更新文章失敗' })
    }

    // Update article
    let videoUpdate = { url, source }
    let vKeys = Object.keys(videoUpdate)
    for (let k of vKeys) {
      if (videoUpdate[k] === null || videoUpdate[k] === undefined) {
        delete videoUpdate[k]
      }
    }

    let [videoErr] = await to(video.updateOne({ _id: articleData.video }, videoUpdate))
    if (videoErr) {
      logger.error(`${logHead}Find err`, videoErr)
      return res.json({ status: 500, message: '更新影片資訊失敗' })
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

    // 查文章資料
    let [findAErr, articleData] = await to(article.findOne({ id }))
    if (findAErr || !articleData) {
      logger.error(`${logHead}Find err`, findAErr)
      return res.json({ status: 500, message: '找不到該文章' })
    }
    const { _id } = articleData

    // 附屬於文章底下的評論也要刪除
    let [findFErr, flamesData] = await to(flames.find({ article: _id }))
    if (findFErr || !flamesData) {
      logger.error(`${logHead}Find err`, findAErr)
      return res.json({ status: 500, message: '找不到該評論' })
    }

    console.log(`${logHead}#220`, flamesData)
    for (let i = 0, len = flamesData.length; i < len; i++) {
      let flame = flamesData[i]
      let [dfErr] = await to(flames.deleteOne({ id: flame.article }))
      if (dfErr) {
        logger.error(`${logHead}Delete err`, dfErr)
        return res.json({ status: 500, message: '找不到該評論' })
      }
    }

    let [daErr] = await to(article.deleteOne({ id }))
    if (daErr) {
      logger.error(`${logHead}Delete err`, daErr)
      return res.json({ status: 500, message: '找不到該文章' })
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
    console.info(`Find article: ${id}`)
    let [findErr, data] = await to(article.findOne({ id })
      .populate('user', 'name')
      .populate('video', '_id url source')
      .populate('tag', 'id name')
    )
    if (findErr || !data) {
      logger.error(`${logHead}Find article err`, findErr)
      return res.json({ status: 500, message: '找不到該文章' })
    }

    data.source = data.video.source
    data.videoId = data.video._id
    data.video = data.video.url
    data.name = data.user ? data.user.name : null
    data.tagId = data.tag ? data.tag.id : null
    data.tag = data.tag ? data.tag.name : null

    delete data.user
    delete data.flames
    delete data.status
    delete data.screenshot

    let result = {
      status: 200,
      message: 'ok',
      data: { article: data }
    }

    return res.json(result)
  }
}
