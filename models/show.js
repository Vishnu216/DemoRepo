const mongoose = require('mongoose')

const viewSchema = new mongoose.Schema({
   name: {
      type: String,
      required: true,
   },
   email: {
      type: String,
      required: true,
      unique: true,
   },
   date: {
      type: Date,
      default: Date.now,
   },
})

const User = mongoose.model('user', viewSchema)

module.exports = User
