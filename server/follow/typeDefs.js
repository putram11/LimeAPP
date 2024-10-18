const followTypeDefs = `#graphql
  type Follow {
    _id: ID!                # Unique identifier for the follow relationship
    followingUser: User!    # User that is being followed
    followerUser: User!      # User that is following
    createdAt: String!      # Timestamp of when the follow relationship was created
    updatedAt: String!      # Timestamp of the last update to the follow relationship
  }

  type Mutation {
    followUser(followingId: ID!): String   # Follow a user by their ID and return a success message
  }
`;

module.exports = followTypeDefs;
