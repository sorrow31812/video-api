import fs from 'fs'
import to from 'await-to-js'
import _ from 'lodash'
import { logger } from '../../lib'
import { screenshot } from '../../models'
import config from '../../config/configs.js'

const logHead = `[Screenshot] `
export default {
  /**
   * 截圖相關api
   * @param {*} req
   * @param {*} res
   */
  async find (req, res) {
    console.info(`Find screenshot`)
    // 檢查該影片是否有截圖存在資料庫，有的話預設會回傳最多留言的那張；沒有的話screenshot為空。
    const { imgFolder } = config.getConfigs()
    const { params } = req
    const { id } = params
    let resJson = { status: 200, message: 'ok', data: { screenshot: {} } }
    // Find all image of this video
    let [sErr, sc] = await to(screenshot.find({ video: id }, 'id time img').sort({ flamesCount: -1 }).limit(2))
    if (sErr) {
      logger.error(`${logHead}Find screenshot err`, sErr)
      return res.json({ status: 500, message: '查找截圖錯誤' })
    }

    if (!sc.length) return res.json(resJson)
    let image = sc[0]
    image.img = `${imgFolder}/${image.img}.png`
    resJson.data.screenshot = { ...image }

    return res.json(resJson)
  },
  async upload (req, res) {
    const { imgFolder } = config.getConfigs()
    let { body } = req
    let { videoId, time, img } = body
    // 先把截圖base64轉圖片再存到imgFolder(/home/admin/screen-pic)
    let base64Data = img.replace(/^data:image\/\w+;base64,/, '')
    let dataBuffer = Buffer.from(base64Data, 'base64')

    let ext = '.png'
    let fileName = `${videoId}-${time}`
    let targetPath = `${imgFolder}/${fileName}${ext}`
    fs.writeFile(targetPath, dataBuffer)

    let [scErr, scData] = await to(screenshot.create({
      img, time, video: videoId
    }))
    if (scErr) {
      logger.error(`${logHead}Save screenshot err`, scErr)
      return res.json({ status: 500, message: '儲存截圖錯誤' })
    }

    let ret = _.pick(scData, ['img', 'id', 'time'])
    let resJson = { status: 200, message: 'ok', data: { screenshot: ret } }

    return res.json(resJson)
  },
  async encode (req, res) {
    // POST body: { imgUrl }
    let { body } = req
    let { imgUrl } = body
    console.log(imgUrl)
    let bitmap = fs.readFileSync(imgUrl)

    let base64Data = bitmap.toString('base64')
    let resJson = { status: 200, message: 'ok', data: { screenshot: base64Data } }
    return res.json(resJson)
  }
}
