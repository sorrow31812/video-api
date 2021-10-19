const mongoose = require('./mongoose')
const moment = require('moment')

const { Schema } = mongoose.promisify()
const { Mixed } = Schema.Types

module.exports = (schema, options = null) => {
  schema.add({
    // 建立時間
    createdAt: {
      type: Number,
      default: Date.now,
      index: true
    },

    // 更新時間
    updatedAt: {
      type: Number,
      default: Date.now,
      index: true
    },

    meta: Mixed
  })

  schema.virtual('createdTime').get(function () {
    return moment(this.createdAt).format('YYYY-MM-DD HH:mm:ss')
  })

  schema.virtual('updatedTime').get(function () {
    return moment(this.updatedAt).format('YYYY-MM-DD HH:mm:ss')
  })

  const preUpdate = function () {
    let obj = {
      updatedAt: moment().valueOf()
    }
    if (this.isNew) {
      obj.createdAt = moment().valueOf()
    }
    this.set(obj)
  }
  schema.pre(['save', 'update', 'updateOne', 'updateMany', 'findOneAndUpdate'], preUpdate)
}
