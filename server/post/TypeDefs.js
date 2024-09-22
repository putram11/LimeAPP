const postTypeDefs = `#graphql
  type Post {
    _id: ID!
    content: String!
    tags: [String]
    imgUrl: String
    author: User!
    comments: [Comment]
    likes: [Like]
    createdAt: String!
    updatedAt: String!
    username: String!
  }

  type Comment {
    content: String!
    username: String!
    createdAt: String!
    updatedAt: String!
  }

  type Like {
    username: String!
    createdAt: String!
  }

  type Query {
    getPostById(id: ID!): Post
    getAllPosts: [Post]
  }

  type Mutation {
    createPost(content: String!, tags: [String], imgUrl: String): String
    addComment(postId: ID!, content: String!, username: String): String
    likePost(postId: ID!): String
  }
`;

module.exports = postTypeDefs;
