const getRequestIp = function (req) {
  return (req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress).split(',')[0]
  // return req.headers['x-forwarded-for'] || req.connection.remoteAddress
}

export default getRequestIp
