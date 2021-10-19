module.exports = [{
  validator: (v) => {
    // eslint-disable-next-line no-useless-escape
    return /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/.test(v)
  },
  msg: `{PATH} invalid.`
}]
