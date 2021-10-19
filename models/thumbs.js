const mongoose = require('./mongoose')
const Base = require('./base')

const { Schema, model } = mongoose.promisify()
const { setAutoIncrement } = mongoose
const { ObjectId, Mixed } = Schema.Types

let schema = {
  // 使用者帳號
  user: {
    type: ObjectId,
    index: true,
    required: true
  },

  // 自動 id
  id: {
    type: Number,
    index: true,
    unique: true
  },

  // 推
  up: {
    type: Mixed
  },

  // 噓
  down: {
    type: Mixed
  },

  // 還剩多少票
  thumbs: {
    type: Number,
    require: true
  },

  // 刷新時間
  time: {
    type: String,
    require: true
  },

  // 狀態
  status: {
    type: String,
    default: 'Enabled',
    nums: ['Enabled', 'Disabled', 'Blocked'],
    index: true
  }
}

schema = new Schema(schema)
schema.index({ user: 1, status: 1 })
schema.index({ id: -1, status: 1 })

setAutoIncrement(schema, {
  model: 'Thumbs',
  field: 'id'
})

schema.plugin(Base)

module.exports = model('Thumbs', schema)
