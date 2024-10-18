const UserModel = require("./model");
const { generateToken } = require("../helpers/jsonwebtoken");
const { comparePassword } = require("../helpers/bcrypt");

const userResolvers = {
  Query: {
    // Get user by ID
    getUserById: async (_, { id }, { user }) => {
      // Check if user is authenticated
      if (!user) {
        throw new Error("Authentication required");
      }

      return await UserModel.findById(id);
    },

    // Search users by keyword
    searchUsers: async (_, { keyword }) => {
      return await UserModel.searchUsers(keyword);
    },
  },

  Mutation: {
    // Register a new user
    registerUser: async (_, { name, username, email, password }) => {
      const newUser = {
        name,
        username,
        email,
        password,
      };
      
      return await UserModel.create(newUser);
    },

    // Log in an existing user
    loginUser: async (_, { username, password }) => {
      const user = await UserModel.findByUsername(username);
      if (!user) {
        throw new Error("User not found");
      }

      // Validate password
      const validPassword = comparePassword(password, user.password);
      if (!validPassword) {
        throw new Error("Invalid password");
      }

      // Generate JWT token
      const token = generateToken({
        userId: user._id,
        username: user.username,
      });

      return {
        token,
        user,
      };
    },
  },
};

module.exports = userResolvers;
