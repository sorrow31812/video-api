import { redis, logger } from 'lib'
import config from 'config'
import to from 'await-to-js'
import request from 'superagent'
import { getOperator } from 'api/services'

const getXoperatorToken = async function () {
  // 從暫存中取得營運的 xtoken 資料
  let [xterr, xtoken] = await to(redis.get(`onejinyo:token`))
  if (xterr) throw xterr
  if (xtoken) return xtoken

  let { apiHost } = config.getConfigs()
  let requestUrl = `${apiHost}/token`

  let [operr, operator] = await to(getOperator())
  if (operr || !operator) throw new Error('[getXoperatorToken] Find operator error. #18')

  const { code: xOperator, key: xKey } = operator

  logger.info(`xOperator: ${xOperator}, key: ${xKey}`)

  let [error, response] = await to(request.get(requestUrl)
    .set('X-Operator', xOperator)
    .set('X-Key', xKey)
  )

  if (!error && response.statusCode === 200) {
    xtoken = response.body.data.token
    const [err] = await to(redis.set('onejinyo:token', xtoken, { cacheTime: 60 * 5 }))

    if (err) throw err
  } else {
    logger.debug(requestUrl)
    logger.debug(error)
    throw new Error(error.message)
  }

  return xtoken
}

export default getXoperatorToken
