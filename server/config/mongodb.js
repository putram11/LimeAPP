const { MongoClient, ServerApiVersion } = require("mongodb");

const uri = process.env.DB_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

/**
 * Connect to MongoDB and return the database instance.
 * 
 * @returns {Object} - The connected MongoDB database instance.
 * @throws {Error} - Throws an error if unable to connect to MongoDB.
 */
async function connectDB() {
  try {
    // Attempt to connect to MongoDB
    await client.connect();

    // Specify the database to use
    const database = client.db("project1");

    console.log("Successfully connected to MongoDB");

    return database; // Return the database instance for further operations
  } catch (err) {
    console.error("Error connecting to MongoDB:", err.message);

    // Throw error to be handled by caller
    throw new Error("Failed to connect to MongoDB");
  }
}

module.exports = { connectDB };
