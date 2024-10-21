const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters long']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  }
}, {
  timestamps: true
})

userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    try {
      this.password = await bcrypt.hash(this.password, 8);
      console.log('Password hashed successfully')
    } catch (error) {
      console.error('Error hashing password:', error)
      next(error)
    }
  }
  next()
})

userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    const isMatch = await bcrypt.compare(candidatePassword, this.password)
    console.log('Password comparison result:', isMatch)
    return isMatch
  } catch (error) {
    console.error('Error comparing passwords:', error)
    return false
  }
}

userSchema.statics.findByCredentials = async function(username, password) {
  const user = await this.findOne({ username })
  if (!user) {
    console.log('User not found:', username)
    throw new Error('Unable to login')
  }
  console.log('User found:', user._id)
  const isMatch = await user.comparePassword(password)
  if (!isMatch) {
    console.log('Password mismatch for user:', username)
    throw new Error('Unable to login')
  }
  return user
}

const User = mongoose.model('User', userSchema)

module.exports = User