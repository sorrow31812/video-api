const mongoose = require('./mongoose')
const Base = require('./base')
const accountValidator = require('./validators/account-validator')
const emailValidator = require('./validators/email-validator')

const { Schema, model } = mongoose.promisify()
const { setAutoIncrement } = mongoose
const { Mixed } = Schema.Types

let schema = {
  // name
  name: {
    type: String,
    index: true,
    trim: true,
    minlength: 2,
    maxlength: 64,
    validate: accountValidator,
    required: true,
    unique: true
  },

  // 自動 id
  id: {
    type: Number,
    index: true,
    unique: true
  },

  // email
  email: {
    type: String,
    index: true,
    required: true,
    validate: emailValidator,
    unique: true
  },

  // 語言
  locale: {
    type: String,
    index: true,
    default: 'zh-tw'
  },

  // 登入密碼
  // pass: {
  //   type: String,
  //   validate: passValidator
  // },

  // 角色
  permission: {
    type: String,
    index: true,
    default: 'User',
    enum: ['User', 'Administrator', 'Guest']
  },

  // hide
  hide: {
    type: Boolean,
    default: false,
    require: true
  },

  //  fb 綁定
  social: {
    type: Mixed
  },

  // 投票回覆次數
  voteTimes: {
    type: Number,
    index: true,
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
schema.index({ username: 1, id: 1 })
schema.index({ id: -1, status: 1 })

schema.virtual('userId').get(function () {
  return this.id
})

setAutoIncrement(schema, {
  model: 'User',
  field: 'id'
})

schema.plugin(Base)

module.exports = model('User', schema)
