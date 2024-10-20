const redis = require('redis');

const client = redis.createClient(process.env.REDIS_URL);

client.connect().catch(console.error);

const setCache = async (key, value, expiration = 3600) => {
  try {
    await client.set(key, JSON.stringify(value), {
      EX: expiration,
    });
  } catch (error) {
    console.error('Redis set error:', error);
  }
};

const getCache = async (key) => {
  try {
    const value = await client.get(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error('Redis get error:', error);
    return null;
  }
};

const deleteCache = async (key) => {
  try {
    await client.del(key);
  } catch (error) {
    console.error('Redis delete error:', error);
  }
};

module.exports = { setCache, getCache, deleteCache };