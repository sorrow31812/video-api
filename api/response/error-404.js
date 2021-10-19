import _ from 'lodash'

export default (req, res) => (error) => {
  let message = 'Not Found'

  if (_.isError(error)) {
    message = error.message
  } else if (_.isString(error)) {
    message = error
  }

  res.status(404).json({ message, status: 404 })
}
