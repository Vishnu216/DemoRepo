const mongoose = require('mongoose')

const profileSchema = new mongoose.Schema({
   user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
   },
   photo: {
      type: String,
      default:
         'https://res.cloudinary.com/writive/image/upload/v1598101487/blank_image_uqejwa.jpg',
   },
   status: {
      type: String,
   },
   location: {
      type: String,
   },
   bio: {
      type: String,
   },
   date: {
      type: Date,
      default: Date.now,
   },
})

const Profile = mongoose.model('profile', profileSchema)

module.exports = Profile
