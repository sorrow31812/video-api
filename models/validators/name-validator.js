module.exports = [{
  validator: (v) => {
    // eslint-disable-next-line no-useless-escape
    const hasSymbol = /[-!$%^&*()_+|~=`{}\[\]:";'<>?,.\/]/g.test(v)
    return !hasSymbol
  },
  msg: `{Path} invalid.`
}]
