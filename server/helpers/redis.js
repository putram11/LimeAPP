// redisClient.js
const { createClient } = require("redis");

const client = createClient({
  password: process.env.REDIS_PASS,
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});

// Error handling
client.on("error", (err) => {
  console.error("Redis Client Error:", err);
});

// Fungsi untuk menghubungkan ke Redis
const connectRedis = async () => {
  try {
    await client.connect();
    console.log("Connected to Redis");
  } catch (error) {
    console.error("Failed to connect to Redis:", error);
  }
};

connectRedis();

module.exports = client;
