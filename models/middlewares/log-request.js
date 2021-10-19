import { requestLog } from 'config'
import { RequestLog } from 'models'
import { logger } from 'lib'
import { getRequestIp } from 'api/services'
import to from 'await-to-js'

const logRequest = async (req, res, next) => {
  const url = `${req.protocol}://${req.get('host')}${req.originalUrl}`
  const ip = getRequestIp(req)
  const { method, path, body, query, clientType } = req
  const headers = {
    'Content-Type': req.get('Content-Type'),
    'X-Token': req.get('X-Token'),
    'BX-Operator': req.get('BX-Operator'),
    'BX-Key': req.get('BX-Key')
  }
  if (!requestLog.includes(method)) return next()
  const request = { body, query, headers }
  const [err, doc] = await to(RequestLog.create({ url, ip, method, path, request, clientType }))
  if (err) logger.error(`Create request log error: ${err.message}`)

  res.logId = doc.id
  next()
}

export default logRequest
