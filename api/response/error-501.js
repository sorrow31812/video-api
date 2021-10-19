import _ from 'lodash'

export default (req, res) => (error) => {
  let message = 'Not Implemented'

  if (_.isError(error)) {
    message = error.message
  } else if (_.isString(error)) {
    message = error
  }

  res.status(501).json({ message, status: 501 })
}
