import { UserOauth, User, Balance, Task } from 'models'
import { getProvider } from 'api/services'
import { logger } from 'lib'
import to from 'await-to-js'
import _ from 'lodash'

const logHead = `[services.bindingOauth] `
const bindingOauth = async function (user, oauthData, authType) {
  const { id: userId } = user
  let [oaErr, newAuth] = await to(UserOauth.create(oauthData))
  if (oaErr) {
    logger.warn(`${logHead}#11`, oaErr)
    throw oaErr
    // return res.status500()
  }

  const [err, provider] = await to(getProvider())
  if (err) {
    logger.warn(`${logHead}#18`, err)
    throw err
  }

  let userUpd = {}
  userUpd[`${authType}Auth`] = newAuth._id
  const [uerr] = await to(User.updateOne({ id: userId }, userUpd))
  if (uerr) {
    logger.warn(`${logHead}#24`, uerr)
    throw uerr
  }

  const { id: providerId } = provider
  let [berr, balance] = await to(Balance.findOne({ userId, providerId }))
  if (berr) {
    logger.warn(`${logHead}#58`, berr)
    throw berr
  } else if (!balance) {
    logger.warn(`${logHead}#61 User's(${user.name}) balance not found.`)
    throw new Error('Find balance error')
  }

  user[`${authType}Auth`] = newAuth.toObject()
  balance = _.pick(balance.toObject(), ['amount', 'gemAmount'])

  const tquery = {
    userId,
    key: authType,
    category: 'SocialAuth',
    type: 'Achievement',
    status: 'InProgress'
  }

  logger.info(`${logHead}#53`, tquery)
  const [terr, task] = await to(Task.findOneAndUpdate(tquery, { status: 'Finished' }, { new: true })
    .populate('games', 'name checksum code gameId _id taskId')
  )
  if (terr) {
    logger.warn(`${logHead}#53`, terr)
    throw terr
  }

  let resJson = {
    user: {
      ...user,
      balance
    }
  }

  if (task) {
    let newTask = _.pick(task, ['name', 'game', 'type', 'category', 'isLevelUp', 'pointReward', 'gemReward', 'goodsReward', 'avatarReward', 'avatarFrameReward', 'vipPointReward', 'key', '_id'])
    const { goodsReward, avatarReward, avatarFrameReward } = newTask
    newTask.goodsReward = _.size(goodsReward)
    newTask.avatarReward = _.size(avatarReward)
    newTask.avatarFrameReward = _.size(avatarFrameReward)
    newTask.isLevelUp = false
    newTask.isAuthLink = true
    resJson.tasks = [newTask]
  }

  return resJson
}

export default bindingOauth
