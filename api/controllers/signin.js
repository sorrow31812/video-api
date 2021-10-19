import oauth from './auth'

export default {
  signin: async function (req, res) {
    console.log('Sign in controllers')
    const { type } = req.params
    await oauth[type].signin(req, res)
  }
}
