import _ from 'lodash'

export default (req, res) => (error) => {
  let message = 'Not Acceptable'

  if (_.isError(error)) {
    message = error.message
  } else if (_.isString(error)) {
    message = error
  }

  res.status(406).json({ message, status: 406 })
}
