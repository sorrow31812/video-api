module.exports = [{
  validator: (v) => {
    // eslint-disable-next-line no-useless-escape
    const phoneno = /^\+?\d+(-|\s)?\d+(\d|-|\s)+$/
    return phoneno.test(v)
  },
  msg: `{PATH} invalid.`
}]
