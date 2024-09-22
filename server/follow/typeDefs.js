const followTypeDefs = `#graphql
  type Follow {
    _id: ID!
    followingUser: User!
    followerUser: User!
    createdAt: String!
    updatedAt: String!
  }

  type Mutation {
    followUser(followingId: ID!): String
  }
`;

module.exports = followTypeDefs;
