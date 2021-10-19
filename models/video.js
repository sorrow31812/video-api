const mongoose = require('./mongoose')
const Base = require('./base')

const { Schema, model } = mongoose.promisify()
const { setAutoIncrement } = mongoose
// const { ObjectId } = Schema.Types

let schema = {
  // 影片連結
  url: {
    type: String,
    index: true,
    required: true
  },

  // 自動 id
  id: {
    type: Number,
    index: true,
    unique: true
  },

  // 影片來源
  source: {
    type: String,
    required: true
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
schema.plugin(Base)

setAutoIncrement(schema, {
  model: 'Video',
  field: 'id'
})

module.exports = model('Video', schema)
