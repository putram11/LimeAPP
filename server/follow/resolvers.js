const { ObjectId } = require("mongodb");
const FollowModel = require("./model");

const followResolvers = {
  Mutation: {
    /**
     * Follow a user by their ID.
     *
     * @param {Object} _ - Unused root object.
     * @param {Object} args - Arguments containing the ID of the user to follow.
     * @param {String} args.followingId - The ID of the user to follow.
     * @param {Object} context - Context object containing the database connection and user info.
     * @param {Object} context.db - The database instance.
     * @param {Object} context.user - The authenticated user initiating the follow action.
     * @returns {String} - A success message indicating the follow action was successful.
     * @throws {Error} - Throws an error if the user is not authenticated.
     */
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
    /**
     * Fetch the user being followed in a follow relationship.
     *
     * @param {Object} parent - The follow relationship object.
     * @param {Object} _ - Unused argument.
     * @param {Object} context - Context object containing the database connection.
     * @param {Object} context.db - The database instance.
     * @returns {Object} - The user object that is being followed.
     */
    followingUser: async (parent, _, { db }) => {
      return await db
        .collection("users")
        .findOne({ _id: new ObjectId(parent.followingId) });
    },

    /**
     * Fetch the user who is the follower in a follow relationship.
     *
     * @param {Object} parent - The follow relationship object.
     * @param {Object} _ - Unused argument.
     * @param {Object} context - Context object containing the database connection.
     * @param {Object} context.db - The database instance.
     * @returns {Object} - The user object that is the follower.
     */
    followerUser: async (parent, _, { db }) => {
      return await db
        .collection("users")
        .findOne({ _id: new ObjectId(parent.followerId) });
    },
  },
};

module.exports = followResolvers;
