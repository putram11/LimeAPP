const { ObjectId } = require("mongodb");
const FollowModel = require("./model");

const followResolvers = {
  Mutation: {
    followUser: async (_, { followingId }, { db, user }) => {
      if (!user) throw new Error("Authentication required");

      const newFollow = {
        followingId: new ObjectId(followingId),
        followerId: new ObjectId(user._id),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await FollowModel.create(newFollow);
      return "Followed successfully";
    },
  },

  Follow: {
    followingUser: async (parent, _, { db }) => {
      return await db
        .collection("users")
        .findOne({ _id: new ObjectId(parent.followingId) });
    },
    followerUser: async (parent, _, { db }) => {
      return await db
        .collection("users")
        .findOne({ _id: new ObjectId(parent.followerId) });
    },
  },
};

module.exports = followResolvers;
