/* eslint-disable no-eval */
import { jwt, logger } from 'lib'
import { getUserVipLevel, getProvider, formatTask, getGiftSettings } from 'api/services'
import { Balance, Task, User } from 'models'
import config from 'config'
import _ from 'lodash'
import to from 'await-to-js'

const logHead = `[services.signInUser] `
const signInUser = async function (userData) {
  let {
    tokenExpiredTime,
    avatarUrl,
    avatarFrameUrl,
    // eslint-disable-next-line no-unused-vars
    gamePlayDomain: hostname,
    gameClassPoints } = config.getConfigs()

  gameClassPoints = gameClassPoints || [2000000, 10000000, 50000000]
  const { id: userId } = userData
  let [uerr, user] = await to(User.findOne({ id: userId }).populate('operator', 'code _id providers id'))
  if (uerr) {
    throw uerr
  }

  if (!user) {
    // throw new Error('User not found')
    logger.warn(`${logHead}#21 User not found.`)
    return null
  }

  user = _.pick(user.toObject(), ['_id', 'id', 'username', 'name', 'fullname', 'locale', 'level', 'avatars', 'avatarFrameList', 'statusMessage', 'test', 'facebookAuth', 'googleAuth', 'appleAuth', 'mobile', 'avatarId', 'avatarFrame', 'operator'])

  // eslint-disable-next-line no-unused-vars
  let { avatarId, avatarFrame } = user
  user.avatarFrameId = avatarFrame

  eval('user.avatar=`' + avatarUrl + '`')
  eval('user.avatarFrame=`' + avatarFrameUrl + '`')

  user.avatars = user.avatars.map(avatarId => {
    let image = ''
    eval('image=`' + avatarUrl + '`')
    return { image, id: avatarId }
  })

  user.avatarFrameList = user.avatarFrameList.map(avatarFrame => {
    let image = ''
    eval('image=`' + avatarFrameUrl + '`')
    return { image, id: avatarFrame }
  })

  let oauthKey = ['facebookAuth', 'googleAuth', 'appleAuth']
  user.oauth = {}
  oauthKey.forEach(key => {
    const val = user[key]
    user.oauth[key] = _.isObject(val) || _.isString(val)
    delete user[key]
  })

  user.oauth.mobile = !!user.mobile
  user.displayName = user.name

  let [verr, vip] = await to(getUserVipLevel(user))
  if (verr) throw verr

  let myVipSettings = await getGiftSettings(user, vip)

  const nameReg = /^one\d+/i
  user = {
    ...user,
    ...vip,
    giftSettings: myVipSettings,
    isNameEditable: nameReg.test(user.name)
  }

  let [perr, provider] = await to(getProvider())
  if (perr) throw perr

  const { id: providerId } = provider
  let [berr, balance] = await to(Balance.findOne({ userId, providerId }))
  if (berr) throw berr

  let [ltErr, levelTask] = await to(Task.findOne({ userId, type: 'Level', category: 'AccountLevelUp', status: 'InProgress' }).sort({ targetValue: 1 }))
  if (ltErr) throw ltErr

  balance = _.pick(balance, ['amount', 'gemAmouint', 'gemAmount'])
  if (levelTask) {
    const { currentValue, targetValue } = levelTask
    user.currentLevelValue = currentValue
    user.nextLevelValue = targetValue
  } else {
    user.currentLevelValue = balance.totalStake || 0
    user.nextLevelValue = -1
  }

  const { amount: point } = balance
  let { level, vipLevel } = user
  level = parseInt(level)
  vipLevel = parseInt(vipLevel)
  let gameClass = []
  if (point < gameClassPoints[0] || vipLevel < 1) gameClass = ['1']
  if (level >= 5 && vipLevel >= 1 && vipLevel <= 2 && point >= gameClassPoints[0]) gameClass.push('2')
  if (level >= 15 && vipLevel >= 3 && vipLevel <= 4 && point >= gameClassPoints[1]) gameClass.push('3')
  if (level >= 30 && vipLevel >= 5 && point >= gameClassPoints[2]) gameClass.push('4')

  user.gameClass = gameClass
  let data = {
    user,
    balance,
    task: []
  }

  let [terr, tasks] = await to(Task.find({ userId, status: 'Finished' }, 'name games _id taskId currentValue targetValue status type category gameId key pointReward avatarReward gemReward goodsReward')
    .populate('games', 'name checksum code gameId _id')
    .sort({ targetValue: 1 })
  )
  if (terr) throw terr

  tasks = tasks.map(t => t.toObject())
  data.task = tasks
  if (_.size(data.task)) {
    let { tasks, level } = formatTask(data.task)
    tasks = tasks.map((t, i) => {
      const { type, category } = t
      t.isLevelUp = type === 'Level' && category === 'AccountLevelUp'
      t.isAuthLink = category === 'SocialAuth'
      if (_.size(t.games)) t.game = t.games[0]
      t.id = t._id
      delete t.games
      delete t._id
      return t
    })
    data.task = tasks || []

    if (level) {
      await User.updateOne({ userId }, { level })
      data.user.level = level
    }
  }

  const [tkerr, token] = await to(jwt.sign(user, tokenExpiredTime))
  if (tkerr) throw tkerr
  if (!token) {
    logger.debug(`${logHead}#125`)
    throw new Error('Sign in error')
  }

  let resJson = {
    data,
    token
  }

  return resJson
}

export default signInUser
