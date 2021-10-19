const mongoose = require('./mongoose')
const Base = require('./base')

const { Schema, model } = mongoose.promisify()
const { setAutoIncrement } = mongoose
const { Mixed, ObjectId } = Schema.Types

let schema = {
  // 自動 id
  id: {
    type: Number,
    index: true,
    unique: true
  },

  // 字幕
  subtitle: {
    type: String
  },

  // 截圖_id
  screenshot: {
    type: ObjectId,
    ref: 'Screenshot',
    index: true
  },

  // 文章_id
  article: {
    type: ObjectId,
    ref: 'Article',
    index: true
  },

  // 使用者_id
  user: {
    type: ObjectId,
    ref: 'User',
    index: true
  },

  // 標記座標
  mark: {
    type: Mixed
  },

  slug: {
    type: String,
    unique: true,
    require: true
  },

  // 內容
  content: {
    type: String,
    require: true
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
schema.index({ article: 1, screenshot: 1 })
schema.index({ user: 1, article: 1 })
schema.index({ user: 1, screenshot: 1 })

setAutoIncrement(schema, {
  model: 'Flames',
  field: 'id'
})

schema.plugin(Base)

module.exports = model('Flames', schema)
