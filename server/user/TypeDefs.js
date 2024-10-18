const userTypeDefs = `#graphql
  type User {
    _id: ID!
    name: String!
    username: String!
    email: String!
    followers: [User]!
    following: [User]!
    userPosts: [Post]!
    createdAt: String!
    updatedAt: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    getUserById(id: ID!): User
    searchUsers(keyword: String!): [User]
  }

  type Mutation {
    registerUser(name: String!, username: String!, email: String!, password: String!): User
    loginUser(username: String!, password: String!): AuthPayload
  }
`;

module.exports = userTypeDefs;
