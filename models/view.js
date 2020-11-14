const mongoose = require('mongoose')

const viewSchema = new mongoose.Schema({
   name: {
      type: String,
      required: fale,
   },
   email: {
      type: String,
      required: true,
      unique: true,
   },
})

const User = mongoose.model('user1', viewSchema)

module.exports = User

const test = "Hello world shfdbjsdf"