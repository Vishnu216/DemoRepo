const mongoose = require('mongoose')

const viewSchema = new mongoose.Schema({
   name: {
      type: String,
      required: false,
      unique: true,
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

const User = mongoose.model('user1', viewSchema)

module.exports = User


const test = 'Hello world shfdbjsdf'