import _ from 'lodash'

export default (req, res) => (error) => {
  let message = 'Expectation Failed'

  if (_.isError(error)) {
    message = error.message
  } else if (_.isString(error)) {
    message = error
  }

  res.status(417).json({ message, status: 417 })
}
