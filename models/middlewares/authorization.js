// import { logger } from 'lib'
const authorization = async (socket, next) => {
  // var handshakeData = socket.request
  // logger.info(`================================== `)
  // logger.info(handshakeData.headers)
  // logger.info(`================================== `)
  next()
}

export default authorization
