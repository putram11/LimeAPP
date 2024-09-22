const { ObjectId } = require("mongodb");
const { connectDB } = require("../config/mongodb");
const client = require("../helpers/redis");

class PostModel {
  // Create a new post
  static async create(postData) {
    try {
      const db = await connectDB();
      const result = await db.collection("posts").insertOne(postData);

      const cacheKey = "all-posts";

      await client.del(cacheKey);

      return result;
    } catch (error) {
      throw new Error(`Error creating post: ${error.message}`);
    }
  }

  static async findById(postId) {
    try {
      const db = await connectDB();

      if (!ObjectId.isValid(postId)) {
        throw new Error("Invalid Post ID");
      }

      const post = await db
        .collection("posts")
        .aggregate([
          {
            $match: { _id: new ObjectId(postId) },
          },
          {
            $lookup: {
              from: "users",
              localField: "authorId",
              foreignField: "_id",
              as: "author",
            },
          },
          {
            $unwind: "$author",
          },
          {
            $project: {
              imgUrl: 1,
              createdAt: 1,
              authorId: 1,
              content: 1,
              comments: 1,
              likes: 1,
              tags: 1,
              updatedAt: 1,
              username: "$author.username",
            },
          },
        ])
        .next();

      if (!post) {
        throw new Error("Post not found");
      }
      return post;
    } catch (error) {
      throw new Error(`Error fetching post by ID: ${error.message}`);
    }
  }

  static async findAll() {
    try {
      const cacheKey = "all-posts";

      const cachedPosts = await client.get(cacheKey);

      if (cachedPosts) {
        return JSON.parse(cachedPosts);
      }

      const db = await connectDB();
      const posts = await db
        .collection("posts")
        .aggregate([
          {
            $lookup: {
              from: "users",
              localField: "authorId",
              foreignField: "_id",
              as: "author",
            },
          },
          {
            $unwind: "$author",
          },
          {
            $project: {
              imgUrl: 1,
              createdAt: 1,
              authorId: 1,
              content: 1,
              tags: 1,
              updatedAt: 1,
              username: "$author.username",
            },
          },
        ])
        .toArray();

      await client.set(cacheKey, JSON.stringify(posts));

      return posts;
    } catch (error) {
      throw new Error(`Error fetching all posts: ${error.message}`);
    }
  }

  static async addComment(postId, comment) {
    const db = await connectDB();
    const updatedPost = await db.collection("posts").findOneAndUpdate(
      { _id: new ObjectId(postId) },
      {
        $push: { comments: comment },
        $set: { updatedAt: new Date().toISOString() },
      },
      { returnOriginal: false }
    );
    return updatedPost.value;
  }

  static async addLike(postId, like) {
    const db = await connectDB();
    const updatedPost = await db.collection("posts").findOneAndUpdate(
      { _id: new ObjectId(postId) },
      {
        $push: { likes: like },
        $set: { updatedAt: new Date().toISOString() },
      },
      { returnOriginal: false }
    );
    return updatedPost.value;
  }
}

module.exports = PostModel;
