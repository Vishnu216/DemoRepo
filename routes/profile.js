const express = require('express')
const router = express.Router()
const User = require('../models/user')
const Profile = require('../models/profile')
const auth = require('../middleware/auth')

// Update profile
router.patch('/updateprofile', [auth], async (req, res) => {
   try {
      const { photo, status, bio, location } = req.body

      let profileFields = {}

      if (photo) {
         profileFields = {
            photo,
            status: status ? status : '',
            bio: bio ? bio : '',
            location: location ? location : '',
         }
      } else {
         profileFields = {
            status: status ? status : '',
            bio: bio ? bio : '',
            location: location ? location : '',
         }
      }

      const profile = await Profile.findOneAndUpdate(
         { user: req.user._id },
         { $set: profileFields },
         { new: true }
      ).populate('user', ['_id', 'name'])

      await profile.save()
      res.json(profile)
   } catch (err) {
      console.error(err.message)
      res.status(500).send('Server Error!')
   }
})

// Get my profile
router.get('/myprofile', [auth], async (req, res) => {
   try {
      const profile = await Profile.findOne({
         user: req.user._id,
      }).populate('user', ['_id', 'name'])

      if (!profile) {
         return res
            .status(404)
            .json({ msg: 'There is no profile for this user!' })
      }

      res.json(profile)
   } catch (err) {
      console.error(err.message)
      res.status(500).send('Server Error')
   }
})

// Get others profile
router.get('/profile/:user_id', [auth], async (req, res) => {
   try {
      const profile = await Profile.findOne({
         user: req.params.user_id,
      }).populate('user', ['_id', 'name'])

      if (!profile) {
         return res.status(404).json({ msg: 'Profile not found' })
      }

      res.json(profile)
   } catch (err) {
      console.error(err.message)
      res.status(500).send('Server Error')
   }
})

module.exports = router
