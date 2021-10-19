module.exports = [{
  validator: (v) => {
    // eslint-disable-next-line no-useless-escape
    const hasSymbol = /[!$%^&*()+|~=`{}\[\]:";'<>?,.\/]/g.test(v)
    return !hasSymbol
  },
  msg: `{PATH} invalid.`
}]
