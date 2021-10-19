import error from 'api/response'
// import _ from 'lodash'

const extendResponse = function (req, res, next) {
  Object.keys(error).forEach(errName => {
    res[`${errName.replace('error', 'status')}`] = error[errName](req, res)
  })

  next()
}

export default extendResponse
