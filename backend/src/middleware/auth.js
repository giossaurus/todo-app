const jwt = require('jsonwebtoken')
const User = require('../models/User')

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '')
    console.log('Verifying token')
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    console.log('Token verified, finding user')
    const user = await User.findOne({ _id: decoded._id })

    if (!user) {
      console.log('User not found')
      throw new Error()
    }

    console.log('User authenticated:', user._id)
    req.token = token
    req.user = user
    next()
  } catch (error) {
    console.error('Authentication error:', error)
    res.status(401).json({ error: 'Please authenticate.' })
  }
}

module.exports = auth