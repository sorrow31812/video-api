const mongoose = require('./mongoose')
const Base = require('./base')

const { Schema, model } = mongoose.promisify()
const { setAutoIncrement } = mongoose
const { ObjectId } = Schema.Types

let schema = {
  // 截圖
  img: {
    type: String,
    required: true
  },

  // 自動 id
  id: {
    type: Number,
    index: true,
    unique: true
  },

  // 時間點
  time: {
    type: String,
    index: true,
    require: true
  },

  // 影片_id
  video: {
    type: ObjectId,
    ref: 'Video',
    index: true,
    require: true
  },

  // 總共有多少評論使用該截圖
  frameCount: {
    type: Number,
    default: 0
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
schema.index({ video: 1, time: 1 })

setAutoIncrement(schema, {
  model: 'Screenshot',
  field: 'id'
})

schema.plugin(Base)

module.exports = model('Screenshot', schema)
