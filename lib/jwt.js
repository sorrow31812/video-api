const jwt = require('jsonwebtoken')

let keys, expiredTime
let Jwt = {
  init (opts) {
    let { privateKey, publicKey, expiredTime: exp } = opts
    if (!privateKey || !publicKey) {
      throw new Error(`Not privateKey/publicKey.`)
    }
    keys = {
      publicKey,
      privateKey
    }

    expiredTime = exp || 60 * 60 * 24
  },
  sign (data, exp) {
    return new Promise((resolve, reject) => {
      const { privateKey } = keys
      jwt.sign({ data }, privateKey, { algorithm: 'RS256', expiresIn: exp || expiredTime }, function (err, token) {
        if (err) return reject(err)
        return resolve(token)
      })
    })
  },
  verify (token) {
    return new Promise((resolve, reject) => {
      const { publicKey } = keys
      jwt.verify(token, publicKey, function (err, decoded) {
        if (err) return reject(err)
        return resolve(decoded)
      })
    })
  }
}

module.exports = Jwt
