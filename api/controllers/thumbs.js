import to from 'await-to-js'
import { logger } from '../../lib'
import { thumbs, article } from '../../models'

const logHead = `[Thumbs] `
export default {
  /**
   * 類別管理
   * @param {*} req
   * @param {*} res
   */
  async find (req, res) {
    console.info(`Find thumbs`)
    const { user } = req
    const { _id } = user

    let thumbsQuery = { user: _id }
    let [tErr, thumbsData] = await to(thumbs.findOne(thumbsQuery))
    if (tErr || !thumbsData) {
      logger.error(`${logHead}Find thumbs err`, tErr)
      return res.json({ status: 500, message: '找不到該使用者' })
    }

    let result = {
      status: 200,
      message: 'ok',
      data: {
        thumbs: {
          thumbs: thumbsData.thumbs,
          time: thumbsData.time
        }
      }
    }

    console.log(JSON.stringify(result))

    return res.json(result)
  },
  async update (req, res) {
    let { user, body } = req
    let { _id } = user
    let { id, thumbs: tbs } = body
    let thumbsUpdate = { $push: {}, $inc: { thumbs: -1 } }
    let articleQuery = { $inc: {} }

    if (tbs) {
      articleQuery.$inc.thumbsUp = 1
      thumbsUpdate.$push.up = id
    } else {
      articleQuery.$inc.thumbsDown = 1
      thumbsUpdate.$push.down = id
    }

    // 先更新文章
    let [aErr, articleData] = await to(article.updateOne(articleQuery))
    if (aErr || !articleData) {
      logger.error(`${logHead}Update article err`, aErr)
      return res.json({ status: 500, message: '找不到該文章' })
    }

    // 更新該使用者的推噓次數
    let thumbsQuery = { user: _id }
    let [tErr, thumbsData] = await to(thumbs.updateOne(thumbsQuery, thumbsUpdate))
    if (tErr || !thumbsData) {
      logger.error(`${logHead}Update thumbs err`, tErr)
      return res.json({ status: 500, message: '找不到該使用者' })
    }

    let result = {
      status: 200,
      message: 'ok',
      data: {
        thumbs: {
          thumbs: thumbsData.thumbs,
          time: thumbsData.time
        },
        article: {
          thumbsUp: articleData.thumbsUp,
          thumbsDown: articleData.thumbsDown
        }
      }
    }

    return res.json(result)
  }
}
