import _ from 'lodash'

export default (req, res) => (error) => {
  let message = 'Method Not Allowed'

  if (_.isError(error)) {
    message = error.message
  } else if (_.isString(error)) {
    message = error
  }

  res.status(405).json({ message, status: 405 })
}
