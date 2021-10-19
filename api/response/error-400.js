import _ from 'lodash'

export default (req, res) => (error) => {
  let message = 'Bad Request'

  if (_.isError(error)) {
    message = error.message
  } else if (_.isString(error)) {
    message = error
  }

  res.status(400).json({ message, status: 400 })
}
