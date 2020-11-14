const mongoose = require('mongoose')

const topicSchema = new mongoose.Schema({
   user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
   },
   text: {
      type: String,
      required: true,
      maxlength: 100,
   },
   description: {
      type: [String],
      required: true,
   },
   name: {
      type: String,
   },
   comments: [
      {
         user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
         },
         text: {
            type: [String],
            required: true,
         },
         name: {
            type: String,
         },
         date: {
            type: Date,
            default: Date.now,
         },
      },
   ],
   date: {
      type: Date,
      default: Date.now,
   },
})

const Topic = mongoose.model('topic', topicSchema)

module.exports = Topic
