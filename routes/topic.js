const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')
const auth = require('../middleware/auth')

const User = require('../models/user')
const Topic = require('../models/topic')

// Create a topic
router.post(
   '/createtopic',
   [
      auth,
      [
         check('text', 'Subject is required').not().isEmpty(),
         check(
            'text',
            'Subject should not be of maximum 100 characters'
         ).isLength({
            max: 100,
         }),
         check('description', 'Description is required').not().isEmpty(),
      ],
   ],
   async (req, res) => {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
         return res.status(400).json({ errors: errors.array() })
      }
      try {
         const user = await User.findById(req.user._id)

         const newTopic = {
            text: req.body.text,
            description: req.body.description,
            user: req.user._id,
            name: user.name,
         }

         const topic = new Topic(newTopic)
         await topic.save()

         res.json(topic)
      } catch (err) {
         console.error(err.message)
         res.status(500).send('Server Error!')
      }
   }
)

// Get all topics
router.get('/alltopics', [auth], async (req, res) => {
   try {
      const topics = await Topic.find().sort({ date: -1 }) //Most recent first
      res.json(topics)
   } catch (err) {
      console.error(err.message)
      res.status(500).send('Server Error!')
   }
})

// Get a particular topic
router.get('/singletopic/:topic_id', [auth], async (req, res) => {
   try {
      const topic = await Topic.findById(req.params.topic_id)

      if (!topic) {
         return res.status(404).json({ msg: 'Topic not found!' })
      }

      res.json(topic)
   } catch (err) {
      console.error(err.message)
      res.status(500).send('Server Error!')
   }
})

// Delete a topic
router.delete('/deletetopic/:topic_id', [auth], async (req, res) => {
   try {
      const topic = await Topic.findById(req.params.topic_id)

      if (!topic) {
         return res.status(404).json({ msg: 'Topic not found!' })
      }

      // Make sure user is deleting his own topic
      if (topic.user.toString() !== req.user._id.toString()) {
         return res.status(401).json({ msg: 'User not authorized!' })
      }
      await topic.remove()

      res.json(topic)
   } catch (err) {
      console.error(err.message)
      res.status(500).send('Server Error!')
   }
})

// Create a comment
router.patch(
   '/createcomment/:topic_id',
   [auth, [check('text', 'Text is required').not().isEmpty()]],
   async (req, res) => {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
         return res.status(400).json({ errors: errors.array() })
      }
      try {
         const user = await User.findById(req.user._id)
         const topic = await Topic.findById(req.params.topic_id)

         const newComment = {
            text: req.body.text,
            name: user.name,
            user: req.user._id,
         }

         topic.comments.push(newComment)
         await topic.save()

         res.json(topic.comments)
      } catch (err) {
         console.error(err.message)
         res.status(500).send('Server Error!')
      }
   }
)

// Delete a comment
router.delete(
   '/deletecomment/:topic_id/:comment_id',
   [auth],
   async (req, res) => {
      try {
         const topic = await Topic.findById(req.params.topic_id)

         // Pull out comment
         const comment = topic.comments.find(
            (comment) => comment._id.toString() === req.params.comment_id
         )

         // Make sure comment exists
         if (!comment) {
            return res.status(404).json({ msg: 'Comment does not exist' })
         }

         // Check user
         if (
            comment.user.toString() !== req.user._id.toString() &&
            req.user._id.toString() !== topic.user.toString()
         ) {
            return res.status(404).json({ msg: 'User not authorized' })
         }

         topic.comments = topic.comments.filter(
            ({ _id }) => _id.toString() !== req.params.comment_id
         )

         await topic.save()

         res.json(topic.comments)
      } catch (err) {
         console.error(err.message)
         res.status(500).send('Server Error!')
      }
   }
)

module.exports = router
