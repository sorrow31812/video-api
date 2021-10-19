import { signInUser } from 'api/services'
import to from 'await-to-js'

export default {
  async find (req, res) {
    const { user } = req
    const [auErr, authData] = await to(signInUser(user))
    if (auErr) {
      return res.status500()
    }

    res.json({
      status: 200,
      message: `success`,
      ...authData
    })
  }
}
