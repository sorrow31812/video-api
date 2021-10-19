import _ from 'lodash'

export default (req, res) => (error) => {
  let message = 'Unauthorized'

  if (_.isError(error)) {
    message = error.message
  } else if (_.isString(error)) {
    message = error
  }

  res.status(401).json({ message, status: 401 })
}
