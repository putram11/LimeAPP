const { ObjectId } = require("mongodb");
const PostModel = require("./model");

const postResolvers = {
  Query: {
    getPostById: async (_, { id }, { user }) => {
      if (!user) throw new Error("Authentication required");

      return await PostModel.findById(id);
    },

    getAllPosts: async (_, __, { user }) => {
      if (!user) throw new Error("Authentication required");

      return await PostModel.findAll();
    },
  },

  Mutation: {
    createPost: async (_, { content, tags, imgUrl }, { user }) => {
      if (!user) throw new Error("Authentication required");

      if (typeof user.userId !== "string") {
        throw new Error("Invalid user ID");
      }

      const randomImageUrl = `https://picsum.photos/1920/1080?random=${Math.floor(
        Math.random() * 1000
      )}`;

      const newPost = {
        content,
        tags,
        imgUrl: randomImageUrl,
        authorId: new ObjectId(user.userId),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      try {
        const insertedId = await PostModel.create(newPost);
        return `Post created successfully with ID: ${insertedId}`;
      } catch (error) {
        throw new Error(`Failed to create post: ${error.message}`);
      }
    },

    addComment: async (_, { postId, content }, { user }) => {
      // Ensure the user is authenticated
      if (!user) throw new Error("Authentication required");

      const comment = {
        content,
        username: user.username,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await PostModel.addComment(postId, comment);

      // Return a success message
      return "Comment successfully added!";
    },

    // Menambahkan like ke post
    likePost: async (_, { postId }, { db, user }) => {
      if (!user) throw new Error("Authentication required");

      const like = {
        username: new ObjectId(user.userId),
        createdAt: new Date().toISOString(),
      };

      await PostModel.addLike(postId, like);

      return "post Liked Succesfully";
    },
  },

  Post: {
    author: async (parent, _, { db }) => {
      return await db
        .collection("users")
        .findOne({ _id: new ObjectId({ authorId: parent.authorId }) });
    },
  },
};

module.exports = postResolvers;
