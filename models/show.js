const mongoose = require('mongoose')

const showSchema = new mongoose.Schema({
   name: {
      type: String,
      required: true,
   },
   email: {
      type: String,
      required: true,
   },
})

const User = mongoose.model('user', showSchema)

module.exports = User
