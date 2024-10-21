const express = require('express')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const router = express.Router()

router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body
    const existingUser = await User.findOne({ username })
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' })
    }

    const user = new User({ username, password });
    await user.save()
    
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: '1h' })
    res.status(201).json({ user: { _id: user._id, username: user.username }, token })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(400).json({ error: 'Registration failed', details: error.message })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body
    console.log(`Login attempt for username: ${username}`)

    const user = await User.findByCredentials(username, password)
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)
    console.log(`JWT created for user: ${username}`)
    res.json({ user: { _id: user._id, username: user.username }, token })
  } catch (error) {
    console.error('Login error:', error.message)
    res.status(401).json({ error: 'Invalid login credentials' })
  }
})

module.exports = router