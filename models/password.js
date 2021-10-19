const mongoose = require('./mongoose')
const Base = require('./base')

const { Schema, model } = mongoose.promisify()
const { setAutoIncrement } = mongoose
const { ObjectId } = Schema.Types

let schema = {
  // 使用者帳號
  user: {
    type: ObjectId,
    index: true,
    ref: 'User',
    trim: true,
    required: true
  },

  // id
  id: {
    type: Number,
    index: true,
    unique: true
  },

  // email
  email: {
    type: String,
    index: true
  },

  // 登入密碼
  password: {
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
schema.index({ email: 1 })
schema.plugin(Base)

setAutoIncrement(schema, {
  model: 'Password',
  field: 'id'
})

module.exports = model('Password', schema)
