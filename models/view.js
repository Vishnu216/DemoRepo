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
})

const User = mongoose.model('user', viewSchema)

module.exports = User

const test = "Hello world"