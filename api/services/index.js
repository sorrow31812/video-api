// @create-index this file is created by create-index.js.
import bindingOauth from './binding-oauth'
import getRequestIp from './get-request-ip'
import getXoperatorToken from './get-xoperator-token'
import signInUser from './sign-in-user'
import slugify from './slugify'
import verifyLogin from './verify-login'

export { bindingOauth, getRequestIp, getXoperatorToken, signInUser, slugify, verifyLogin }

const moduleList = {
  bindingOauth,
  getRequestIp,
  getXoperatorToken,
  signInUser,
  slugify,
  verifyLogin
}

export default moduleList
