const mongoose = require('mongoose')
const bluebird = require('bluebird')
const to = require('await-to-js').default

bluebird.promisifyAll(mongoose)
let Counter
const Mongoose = {
  init (opts) {
    return new Promise((resolve, reject) => {
      let { host } = opts
      delete opts.host
      delete opts.models
      mongoose.connect(host, opts, (err) => {
        if (err) {
          console.log(`mongoose connected!`)
          console.log(err)
          return reject(err)
        }

        const counterSchema = new mongoose.Schema({
          model: {
            type: String,
            index: true,
            required: true
          },
          number: {
            type: Number,
            default: 0
          }
        })

        Counter = mongoose.model('Counter', counterSchema)

        console.log(`mongoodb connected!`)
        resolve()
      })

      mongoose.connection.on('disconnected', () => {
        console.log(`mongodb disconnected!`)
      })
    })
  },
  promisify () {
    return mongoose
  },
  setAutoIncrement (schema, options) {
    const { model, field } = options
    schema.pre('save', async function () {
      if (this.isNew) {
        const [err, counter] = await to(Counter.findOneAndUpdate({ model }, { $inc: { number: 1 } }, { upsert: true, new: true }))
        if (err) console.log(`FindOneAndUpdate ${model}.${field} error: ${err.message}`)
        this[field] = counter.number
      }
    })
  },
  async startSession () {
    return mongoose.startSession()
  }
}

module.exports = Mongoose
