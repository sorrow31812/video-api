import to from 'await-to-js'
import _ from 'lodash'
import { logger } from './lib'
import { tag, user, video, article, password } from './models'

const logHead = `[Fake-data]`
const fakeData = async function (words) {
  logger.info(`${logHead}Creating fakeData`)

  let [err, res] = await to(user.countDocuments())
  logger.warn(`User count: ${res}`)
  if (err) return
  if (parseInt(res) > 20) return

  // 產生使用者、文章、評論、類別假資料
  let name = 55688
  let source = 'youtube'
  let title = 'title0'
  let pw = 'p@ssw0rd'
  let slug = 'slugExamle'
  let email = 'test1234@gmail.com'
  let social = { test: 123, test2: '456' }
  let content = { test: 666, test2: '888' }
  let url = 'https://www.youtube.com/watch?v=waYpEQAYf3g'
  let tagAry = ['makeup', 'comic', 'animate', 'traffic', 'political', 'life', 'game', 'knowledge']
  let tagId = null

  for (let i = 0; i < 20; i++) {
    // Create user
    name += i
    email = i + email
    let [userErr, userData] = await to(user.create({ name: _.toString(name), email, social, hide: false, locale: 'zh-tw' }))
    if (userErr) {
      logger.error(`${logHead}create err`, userErr)
      continue
    }

    let p = pw + i
    let [pwErr] = await to(password.create({ user: userData._id, password: p, email }))
    if (pwErr) {
      logger.error(`${logHead}create err`, pwErr)
      continue
    }

    // Create article
    url += i
    let [vdCErr, videoData] = await to(video.create({ url, source }))
    if (vdCErr) {
      logger.error(`${logHead}Create err`, vdCErr)
      continue
    }

    // Create tag
    let tagName = tagAry[i]
    if (tagName) {
      let [tcErr, tagData] = await to(tag.create({ name, enname: 'example' }))
      if (tcErr) {
        logger.error(`${logHead}Create err`, tcErr)
        continue
      }

      tagId = tagData._id
    }

    title += i
    slug += i
    let [articleErr] = await to(article.create({ user: userData._id, title, chMaster: 'Will', chMasterGender: 'Male', content, video: videoData._id, tag: tagId, attribute: 'film', slug }))
    if (articleErr) {
      logger.error(`${logHead}Find err`, articleErr)
      continue
    }

    return true
  }
}

const init = async () => {
  const adminUserQuery = {
    name: '預設管理員',
    email: 'admin@admin.com',
    social: { type: 'email' },
    hide: false,
    locale: 'zh-tw',
    permission: 'Administrator'
  }
  const defaultPassword = '25d55ad283aa400af464c76d713c07ad' // 12345678

  let [userErr, userData] = await to(user.findOne(adminUserQuery))
  if (userErr) return
  if (!_.size(userData)) {
    let [cErr, cRes] = await to(user.create(adminUserQuery))
    if (cErr || !cRes) console.log(cErr) // return

    let [pwErr, pw] = await to(password.create({ user: cRes._id, password: defaultPassword, email: adminUserQuery.email }))
    if (pwErr || !pw) {
      logger.error(`${logHead}create err`, pwErr)
      return res.json({ status: 400, message: '建立密碼失敗' })
    }
  }
}

export default {
  init,
  fakeData
}
