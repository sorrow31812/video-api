const crypto = require('crypto')

let keys
const iv = Buffer.alloc(16, 0)
let key = crypto.createHash('sha256').update(String('secret')).digest('base64').substr(0, 32)

const Crypto = {
  init (opts) {
    let { privateKey, publicKey } = opts
    if (!privateKey || !publicKey) {
      throw new Error(`Not privateKey/publicKey.`)
    }

    keys = {
      publicKey,
      privateKey
    }
  },
  md5 (text) {
    return crypto.createHash('md5').update(text).digest('hex')
  },
  sha1 (text) {
    return crypto.createHash('sha1').update(text).digest('hex')
  },
  encrypt (text, algorithm = 'aes-256-ctr') {
    return new Promise((resolve) => {
      const cipher = crypto.createCipheriv(algorithm, key, iv)
      const cipherText = cipher.update(text, 'utf8', 'hex') + cipher.final('hex')
      return resolve(cipherText)
    })
  },
  decrypt (cipherText, algorithm = 'aes-256-ctr') {
    return new Promise((resolve) => {
      const decipher = crypto.createDecipheriv(algorithm, key, iv)
      const text = decipher.update(cipherText, 'hex', 'utf8') + decipher.final('utf8')
      return resolve(text)
    })
  },
  sign (text, algorithm = 'SHA256') {
    return new Promise((resolve) => {
      const sign = crypto.createSign(algorithm)
      sign.write(text)
      sign.end()
      const { privateKey } = keys
      return resolve(sign.sign(privateKey, 'hex'))
    })
  },
  verify (pass, signature, algorithm = 'SHA256') {
    return new Promise((resolve) => {
      const verify = crypto.createVerify(algorithm)
      verify.write(pass)
      verify.end()
      const { publicKey } = keys
      return resolve(verify.verify(publicKey, signature, 'hex'))
    })
  },
  genRandomString (length) {
    return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length)
  },
  sha512 (password, salt) {
    const hash = crypto.createHmac('sha512', salt)
    hash.update(password)
    const value = hash.digest('hex')
    return {
      salt: salt,
      passwordHash: value
    }
  },
  saltHashPassword (pass) {
    var salt = this.genRandomString(16)
    return this.sha512(pass, salt)
  }
}

module.exports = Crypto
