import _ from 'lodash'

export default (req, res) => (error) => {
  let message = 'Forbidden'

  if (_.isError(error)) {
    message = error.message
  } else if (_.isString(error)) {
    message = error
  }

  res.status(403).json({ message, status: 403 })
}
