const { ObjectId } = require("mongodb");
const { connectDB } = require("../config/mongodb");

class FollowModel {
  // Create a follow relationship
  static async create(followData) {
    const db = await connectDB();
    const result = await db.collection("follows").insertOne(followData);
    return result;
  }

  static async findById(followId) {
    const db = await connectDB();
    return await db
      .collection("follows")
      .findOne({ _id: new ObjectId(followId) });
  }
}

module.exports = FollowModel;
