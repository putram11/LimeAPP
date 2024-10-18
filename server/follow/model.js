const { ObjectId } = require("mongodb");
const { connectDB } = require("../config/mongodb");

class FollowModel {
  /**
   * Create a new follow relationship.
   * 
   * @param {Object} followData - The data for the follow relationship.
   * @returns {Object} - The result of the insertion operation.
   */
  static async create(followData) {
    try {
      const db = await connectDB();
      const result = await db.collection("follows").insertOne(followData);
      return result;
    } catch (error) {
      console.error("Error creating follow:", error.message);
      throw new Error("Failed to create follow relationship");
    }
  }

  /**
   * Find a follow relationship by its ID.
   * 
   * @param {string} followId - The ID of the follow relationship to find.
   * @returns {Object|null} - The found follow relationship or null if not found.
   */
  static async findById(followId) {
    try {
      const db = await connectDB();
      const follow = await db
        .collection("follows")
        .findOne({ _id: new ObjectId(followId) });

      if (!follow) {
        throw new Error("Follow relationship not found");
      }

      return follow;
    } catch (error) {
      console.error("Error finding follow by ID:", error.message);
      throw new Error("Failed to find follow relationship");
    }
  }
}

module.exports = FollowModel;
