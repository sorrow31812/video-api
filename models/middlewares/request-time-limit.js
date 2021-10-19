import { redis, logger } from 'lib'
import to from 'await-to-js'

const requestTimeLimit = (cacheTime, cache = false) => async function (req, res, next) {
  if (!cacheTime) return next()

  const { path, ip, user, __: t } = req
  cacheTime = cacheTime * 1
  let redisKey = `request:limit:${path}:${ip}`
  let cacheKey = `request:cache:${path}:${ip}`

  if (user) {
    redisKey = `request:limit:${path}:${ip}:${user.id}`
    cacheKey = `request:cache:${path}:${ip}:${user.id}`
  }

  const hasLimit = await redis.get(redisKey)

  if (hasLimit === '1') {
    if (Number(cache) === 1) {
      let [jerr, jsonString] = await to(redis.get(cacheKey))
      if (jerr) {
        logger.warn('[requestTimeLimit] operator: ', req.operator)
        // return res.status405(`Request time limit. Try again latter. #18`)
        return res.status405(t('Request time limit. Try again latter.'))
      }

      if (jsonString) {
        logger.warn(`[requestTimeLimit] response via cache`)
        return res.json(JSON.parse(jsonString))
      }
    }

    // return res.status405(`Request time limit. Try again latter. #24`)
    return res.status405(t('Request time limit. Try again latter.'))
  }

  await redis.set(redisKey, '1', { cacheTime })
  if (cache) req.cacheTime = cacheTime + 1
  next()
}

export default requestTimeLimit
