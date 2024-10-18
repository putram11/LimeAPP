// redisClient.js
const { createClient } = require("redis");

// Create a Redis client instance
const client = createClient({
  password: process.env.REDIS_PASS,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});

// Error handling for the Redis client
client.on("error", (err) => {
  console.error("Redis Client Error:", err);
});

/**
 * Connects to the Redis database.
 * @returns {Promise<void>}
 */
const connectRedis = async () => {
  try {
    await client.connect();
    console.log("Connected to Redis");
  } catch (error) {
    console.error("Failed to connect to Redis:", error);
    throw error; // Optional: propagate error for further handling
  }
};

// Initiate connection to Redis
connectRedis();

module.exports = client;
