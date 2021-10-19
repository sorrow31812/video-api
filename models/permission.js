const mongoose = require('./mongoose')
const { Schema, model } = mongoose.promisify()
const { setAutoIncrement } = mongoose
const { Mixed } = Schema.Types

let schema = {
  // 權限名稱
  name: {
    type: String,
    index: true,
    trim: true,
    required: true
  },

  // 權限id
  id: {
    type: Number,
    index: true,
    unique: true
  },

  // permission
  permission: {
    type: Mixed
  }
}

schema = new Schema(schema)
schema.index({ id: 1 })
setAutoIncrement(schema, {
  model: 'Permission',
  field: 'id'
})

module.exports = model('Permission', schema)
