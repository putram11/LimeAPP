const { MongoClient, ServerApiVersion } = require("mongodb");

const uri = process.env.DB_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function connectDB() {
  try {
    // Connect to the MongoDB cluster
    await client.connect();

    // Select the database
    const database = client.db("project1");

    console.log("Connected successfully to MongoDB");

    return database;
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
    throw err;
  }
}

module.exports = { connectDB };
