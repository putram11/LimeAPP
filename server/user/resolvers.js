const UserModel = require("./model");
const { generateToken } = require("../helpers/jsonwebtoken");
const { comparePassword } = require("../helpers/bcrypt");

const userResolvers = {
  Query: {
    getUserById: async (_, { id }, { user }) => {
      if (!user) throw new Error("Authentication required");

      return await UserModel.findById(id);
    },

    searchUsers: async (_, { keyword }) => {
      return await UserModel.searchUsers(keyword);
    },
  },

  Mutation: {
    registerUser: async (_, { name, username, email, password }) => {
      const newUser = {
        name,
        username,
        email,
        password,
      };
      return await UserModel.create(newUser);
    },

    loginUser: async (_, { username, password }) => {
      const user = await UserModel.findByUsername(username);
      if (!user) {
        throw new Error("User not found");
      }

      const validPassword = comparePassword(password, user.password);
      if (!validPassword) {
        throw new Error("Invalid password");
      }

      // Buat token JWT
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
