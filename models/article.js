const mongoose = require('./mongoose')
const Base = require('./base')
const { Schema, model } = mongoose.promisify()
const { setAutoIncrement } = mongoose
const { Mixed, ObjectId } = Schema.Types

let schema = {
  // 作者
  user: {
    type: ObjectId,
    ref: 'User',
    index: true,
    required: true
  },

  // 自動 id
  id: {
    type: Number,
    index: true,
    unique: true
  },

  // 標題
  title: {
    type: String,
    index: true,
    required: true
  },

  // 自動遞增 ID
  articleId: {
    type: Number,
    index: true
  },

  // 推
  thumbsUp: {
    type: Number,
    default: 0
  },

  // 噓
  thumbsDown: {
    type: Number,
    default: 0
  },

  // 頻道主
  chMaster: {
    type: String,
    required: true,
    default: ''
  },

  // 頻道主性別
  chMasterGender: {
    type: String
  },

  // 內容
  content: {
    type: Mixed,
    required: true,
    default: ''
  },

  // slug
  slug: {
    type: String,
    default: '',
    required: true,
    unique: true,
    index: true
  },

  // 類別
  tag: {
    type: ObjectId,
    ref: 'Tag',
    required: true
  },

  // 屬性
  attribute: {
    type: String,
    required: true,
    nums: ['live', 'film']
  },

  // flames_id(array)
  flames: {
    type: Mixed
  },

  // video_id
  video: {
    type: ObjectId,
    ref: 'Video',
    required: true
  },

  // screenshot_id(array)
  screenshot: {
    type: Mixed
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
setAutoIncrement(schema, {
  model: 'Article',
  field: 'id'
})

schema.index({ provider: 1, providerId: 1, actived: 1, status: 1, test: -1, gameId: -1 })
schema.index({ provider: 1, actived: 1, status: 1, test: 1, gameId: -1 })
schema.index({ provider: 1, actived: 1, status: 1, test: 1, category: 1, isHot: 1 })
schema.index({ status: 1, actived: 1, providerId: 1, gameId: -1 })

schema.plugin(Base)
module.exports = model('Article', schema)
