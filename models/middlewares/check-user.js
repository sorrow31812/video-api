// 驗證 X-Token, 登入用戶必需於 header 中夾帶 X-Token
// import { logger } from 'lib'

// const logHead = '[checkUser] '
const checkUser = async (req, res, next) => {
  // const { user } = req
  // if (!user) {
  //   logger.warn(`${logHead}Check user failed`)
  //   return res.status400()
  // }
  next()
}

export default checkUser
