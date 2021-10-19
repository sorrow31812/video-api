module.exports = [{
  validator: (v) => {
    return /\d{4}-\d{2}-\d{2}/.test(v)
  },
  msg: `{PATH} invalid.`
}]
