const mongoose = require('./mongoose')
const Base = require('./base')

const { Schema, model } = mongoose.promisify()
const { setAutoIncrement } = mongoose

let schema = {

  // 自動 id
  id: {
    type: Number,
    index: true,
    unique: true
  },

  // 中文名稱
  name: {
    type: String,
    index: true,
    trim: true,
    minlength: 2,
    maxlength: 64,
    required: true
  },

  // 英文名稱
  enname: {
    type: String,
    index: true,
    trim: true,
    minlength: 2,
    maxlength: 64,
    required: true
  },

  // id
  position: {
    type: Number,
    index: true
  },

  // 隱藏
  hide: {
    type: Boolean,
    default: false
  },

  // 特殊
  special: {
    type: Boolean,
    default: false
  },

  //  狀態
  status: {
    type: String,
    default: 'Enabled',
    nums: ['Enabled', 'Disabled', 'Blocked'],
    index: true
  }
}

schema = new Schema(schema)
schema.index({ username: 1, id: 1 })
schema.index({ position: 1, status: 1 })

setAutoIncrement(schema, {
  model: 'Tag',
  field: 'id'
})

schema.plugin(Base)

module.exports = model('Tag', schema)
