const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
   name: {
      type: String,
      required: true,
   },
   email: {
      type: String,
      required: true,
      unique: true,
   },
   password: {
      type: String,
      required: true,
   },
   resetToken: {
      type: String,
   },
   expireToken: {
      type: Date,
   },
   verifyToken: {
      type: String,
   },
   expireVerifyToken: {
      type: String,
   },
   verified: {
      type: Boolean,
      default: false,
   },
   date: {
      type: Date,
      default: Date.now,
   },
})

const User = mongoose.model('user', userSchema)

module.exports = User
