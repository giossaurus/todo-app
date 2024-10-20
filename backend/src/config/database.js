const mongoose = require('mongoose')
const redis = require('redis')

const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    console.log('Connected to MongoDB Atlas');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1)
  }
}

const connectRedis = async () => {
  const client = redis.createClient({
    url: process.env.REDIS_URL
  })
  try {
    await client.connect()
    console.log('Connected to Redis')
    return client
  } catch (error) {
    console.error('Redis connection error:', error)
    process.exit(1)
  }
};

module.exports = { connectMongoDB, connectRedis }