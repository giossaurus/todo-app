const mongoose = require('mongoose')

const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('Connected to MongoDB Atlas successfully')
    console.log('Database Name:', mongoose.connection.name)
    console.log('MongoDB Host:', mongoose.connection.host)
  } catch (error) {
    console.error('MongoDB connection error:', error)
    process.exit(1)
  }
}

module.exports = { connectMongoDB }