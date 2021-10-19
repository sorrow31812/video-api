import _ from 'lodash'

export default (req, res) => (error) => {
  let message = 'Internal Server Error'

  if (_.isError(error)) {
    message = error.message
  } else if (_.isString(error)) {
    message = error
  }

  res.status(500).json({ message, status: 500 })
}
