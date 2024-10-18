const { connectDB } = require("../config/mongodb");
const { ObjectId } = require("mongodb");
const { hashPassword } = require("../helpers/bcrypt");

class UserModel {
  // Create a new user
  static async create(payload) {
    const db = await connectDB();

    // Validate password length
    if (payload.password.length < 6) {
      throw new Error("Password minimal 6 karakter");
    }

    // Hash the password
    payload.password = hashPassword(payload.password);
    
    // Set createdAt and updatedAt fields
    payload.createdAt = new Date();
    payload.updatedAt = new Date();

    const result = await db.collection("users").insertOne(payload);

    // Fetch the newly created user
    return await db.collection("users").findOne({ _id: result.insertedId });
  }

  // Find a user by username
  static async findByUsername(username) {
    const db = await connectDB();
    return await db.collection("users").findOne({ username });
  }

  // Search for users by name or username
  static async searchUsers(keyword) {
    const db = await connectDB();
    
    const query = {
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { username: { $regex: keyword, $options: "i" } },
      ],
    };

    return await db.collection("users").find(query).toArray();
  }

  // Find a user by their ID
  static async findById(id) {
    const db = await connectDB();

    console.log("Received ID:", id);

    // Check if the ID is valid
    if (!ObjectId.isValid(id)) {
      console.error("Invalid ID format:", id);
      throw new Error("Invalid ID format");
    }

    try {
      const user = await db.collection("users").aggregate([
        {
          $match: { _id: new ObjectId(id) },
        },
        {
          $lookup: {
            from: "posts",
            localField: "_id",
            foreignField: "authorId",
            as: "userPosts",
          },
        },
        {
          $lookup: {
            from: "follows",
            localField: "_id",
            foreignField: "followingId",
            as: "followers",
          },
        },
        {
          $lookup: {
            from: "follows",
            localField: "_id",
            foreignField: "followerId",
            as: "following",
          },
        },
      ]).next();

      console.log("User data retrieved:", user);
      return user;
    } catch (error) {
      console.error("Error fetching user by ID:", error);
      throw new Error("Failed to fetch user");
    }
  }
}

module.exports = UserModel;
