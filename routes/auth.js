const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')
const crypto = require('crypto')
const User = require('../models/user')
const Profile = require('../models/profile')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config/keys')
const Topic = require('../models/topic')
const auth = require('../middleware/auth')
const {
   sendWelcomeEmail,
   sendResetPasswordMail,
   sendVerifyEmail,
   sendCancellationEmail,
} = require('../emails/account')

// Register user
router.post(
   '/register',
   [
      check('name', 'Name is required!').not().isEmpty(),
      check('email', 'Email is required!').not().isEmpty(),
      check(
         'password',
         'Please enter password with 6 or more characters!'
      ).isLength({ min: 6 }),
   ],
   async (req, res) => {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
         return res.status(400).json({ errors: errors.array() })
      }

      try {
         let { name, email, password } = req.body

         let user = await User.findOne({ email: email.toLowerCase() })
         if (user) {
            return res
               .status(400)
               .json({ errors: [{ msg: 'User already exists' }] })
         }

         // Encrypt password
         const salt = await bcrypt.genSalt(10)
         password = await bcrypt.hash(password, salt)

         user = new User({
            name,
            email: email.toLowerCase(),
            password,
         })
         await user.save()

         // Create blank profile photo
         const profile = new Profile({
            user: user._id,
            photo:
               'https://res.cloudinary.com/writive/image/upload/v1598101487/blank_image_uqejwa.jpg',
         })

         await profile.save()

         // Send verification email
         const buffer = crypto.randomBytes(32)
         const verificationToken = buffer.toString('hex')
         user.verifyToken = verificationToken
         user.expireVerifyToken = Date.now() + 360000
         await user.save()
         sendWelcomeEmail(name, email)
         sendVerifyEmail(verificationToken, email)

         // Generate token
         jwt.sign(
            { _id: user._id },
            JWT_SECRET,
            { expiresIn: 360000 },
            (err, token) => {
               if (err) {
                  throw err
               }
               res.json({
                  token,
                  user: {
                     _id: user._id,
                     name: user.name,
                     email: user.email,
                     date: user.date,
                     verified: user.verified,
                  },
                  msg: 'Link to verify email is sent to your email!',
               })
            }
         )
      } catch (err) {
         console.error(err.message)
         res.status(500).send('Server Error!')
      }
   }
)

// Login user
router.post(
   '/login',
   [
      check('email', 'Email is required!').not().isEmpty(),
      check('password', 'Password is required!').not().isEmpty(),
   ],
   async (req, res) => {
      const errors = validationResult(req)
      if (!errors.isEmpty()) {
         return res.status(400).json({ errors: errors.array() })
      }
      try {
         const { email, password } = req.body

         // See if user exists
         let user = await User.findOne({ email: email.toLowerCase() })

         if (!user) {
            return res
               .status(401)
               .json({ errors: [{ msg: 'Invalid Credentials!' }] })
         }

         // Compare passwords
         const isMatch = await bcrypt.compare(password, user.password)

         if (!isMatch) {
            return res
               .status(401)
               .json({ errors: [{ msg: 'Invalid Credentials!' }] })
         }

         // Generate token
         jwt.sign(
            { _id: user._id },
            JWT_SECRET,
            { expiresIn: 360000 },
            (err, token) => {
               if (err) {
                  throw err
               }
               res.json({
                  token,
                  user: {
                     _id: user._id,
                     name: user.name,
                     email: user.email,
                     date: user.date,
                     verified: user.verified,
                  },
               })
            }
         )
      } catch (err) {
         console.error(err.message)
         res.status(500).send('Server Error!')
      }
   }
)

// Get authenticated user's details
router.get('/getuser', [auth], async (req, res) => {
   try {
      const user = await User.findById(req.user._id).select([
         '-password',
         '-resetToken',
         '-expireToken',
         '-verifyToken',
         '-expireVerifyToken',
      ])
      res.json(user)
   } catch (err) {
      console.error(err.message)
      res.status(500).send('Server Error')
   }
})

// Change password
router.patch(
   '/changepassword',
   [
      auth,
      [
         check('oldPassword', 'Old password is required').not().isEmpty(),
         check(
            'password',
            'Please enter password with 6 or more characters'
         ).isLength({ min: 6 }),
      ],
   ],
   async (req, res) => {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
         return res.status(400).json({ errors: errors.array() })
      }

      try {
         let { oldPassword, password } = req.body

         const user = await User.findById(req.user._id)

         const isMatch = await bcrypt.compare(oldPassword, user.password)

         if (!isMatch) {
            return res
               .status(401)
               .json({ errors: [{ msg: 'Old password does not match!' }] })
         }

         // Encrypt password
         const salt = await bcrypt.genSalt(10)
         password = await bcrypt.hash(password, salt)

         user.password = password

         await user.save()

         res.json({ msg: 'Password has been changed successfully!' })
      } catch (err) {
         console.error(err.message)
         res.status(500).send('Server Error!')
      }
   }
)

// Forgot password email link
router.post(
   '/forgotpasswordlink',
   [check('email', 'Email is required!').not().isEmpty()],
   async (req, res) => {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
         return res.status(400).json({ errors: errors.array() })
      }

      try {
         const buffer = crypto.randomBytes(32)
         const token = buffer.toString('hex')
         const user = await User.findOne({
            email: req.body.email.toLowerCase(),
         })
         if (!user) {
            return res
               .status(404)
               .json({ errors: [{ msg: 'Email not registered!' }] })
         }
         user.resetToken = token
         user.expireToken = Date.now() + 360000
         await user.save()
         sendResetPasswordMail(token, user.email)
         res.json({ msg: 'Link to reset the password is sent to your email!' })
      } catch (err) {
         console.error(err.message)
         res.status(500).send('Server Error!')
      }
   }
)

// Forgot password
router.patch(
   '/forgotpassword',
   [
      check(
         'password',
         'Please enter password with 6 or more characters'
      ).isLength({ min: 6 }),
   ],
   async (req, res) => {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
         return res.status(400).json({ errors: errors.array() })
      }
      try {
         let { password, token } = req.body
         const user = await User.findOne({
            resetToken: token,
            expireToken: { $gt: Date.now() },
         })
         if (!user) {
            return res
               .status(404)
               .json({ errors: [{ msg: 'Session has expired!' }] })
         }

         // Encrypt password
         const salt = await bcrypt.genSalt(10)
         password = await bcrypt.hash(password, salt)

         user.password = password
         user.resetToken = undefined
         user.expireToken = undefined

         await user.save()

         res.json({ msg: 'Password has been changed successfully!' })
      } catch (err) {
         console.error(err.message)
         res.status(500).send('Server Error')
      }
   }
)

// Verification email link
router.post(
   '/verifyemaillink',
   [auth, [check('email', 'Email is required!').not().isEmpty()]],
   async (req, res) => {
      const errors = validationResult(req)

      if (!errors.isEmpty()) {
         return res.status(400).json({ errors: errors.array() })
      }

      try {
         const buffer = await crypto.randomBytes(32)
         const token = buffer.toString('hex')
         const user = await User.findOne({
            email: req.body.email.toLowerCase(),
         })
         if (!user) {
            return res
               .status(404)
               .json({ errors: [{ msg: 'Email not registered!' }] })
         }
         user.verifyToken = token
         user.expireVerifyToken = Date.now() + 360000
         await user.save()
         sendVerifyEmail(token, user.email)
         res.json({ msg: 'Link to verify email is sent to your email!' })
      } catch (err) {
         console.error(err.message)
         res.status(500).send('Server Error!')
      }
   }
)

// Verify email
router.patch('/verifyemail', async (req, res) => {
   try {
      let { token } = req.body
      const user = await User.findOne({
         verifyToken: token,
         expireVerifyToken: { $gt: Date.now() },
      }).select([
         '-password',
         '-resetToken',
         '-expireToken',
         '-verifyToken',
         '-expireVerifyToken',
      ])
      if (!user) {
         return res
            .status(404)
            .json({ errors: [{ msg: 'Session has expired!' }] })
      }

      user.verified = true
      user.verifyToken = undefined
      user.expireVerifyToken = undefined

      await user.save()

      res.json({ user, msg: 'Email has been verified successfully!' })
   } catch (err) {
      console.error(err.message)
      res.status(500).send('Server Error!')
   }
})

// Delete account
router.delete('/deleteaccount', [auth], async (req, res) => {
   try {
      // remove users comments
      const topics = await Topic.find({})

      for (let topic of topics) {
         topic.comments = topic.comments.filter(
            (comment) => req.user._id.toString() !== comment.user.toString()
         )
         await topic.save()
      }

      // Get current user's details
      const user = await User.findById(req.user._id)

      // remove users topic
      await Topic.deleteMany({ user: req.user._id })

      // remove profile
      await Profile.findOneAndRemove({ user: req.user._id })

      // remove user
      await User.findOneAndRemove({ _id: req.user._id })

      sendCancellationEmail(user.name, user.email)

      res.json({ msg: 'User deleted' })
   } catch (err) {
      console.error(err.message)
      res.status(500).send('Server Error!')
   }
})

module.exports = router
