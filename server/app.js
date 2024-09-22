if (process.env.NODE_ENV !== "production") require("dotenv").config();

const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const userTypeDefs = require("./user/TypeDefs");
const userResolvers = require("./user/resolvers");
const postTypeDefs = require("./post/TypeDefs");
const postResolvers = require("./post/resolvers");
const followTypeDefs = require("./follow/typeDefs");
const followResolvers = require("./follow/resolvers");
const { connectDB } = require("./config/mongodb");
const { verifyToken } = require("./helpers/jsonwebtoken");

async function startServer() {
  // Koneksi ke MongoDB
  const db = await connectDB();

  // Inisialisasi Apollo Server
  const server = new ApolloServer({
    typeDefs: [userTypeDefs, postTypeDefs, followTypeDefs],
    resolvers: [userResolvers, postResolvers, followResolvers],
    introspection: true,
  });

  try {
    const { url } = await startStandaloneServer(server, {
      listen: { port: 4000 },
      context: async ({ req }) => {
        const token = req.headers.authorization || "";
        let user = null;

        if (token) {
          try {
            user = verifyToken(token.replace("Bearer ", ""));
          } catch (error) {
            console.error("Invalid token:", error);
          }
        }
        return {
          db,
          user,
        };
      },
    });

    console.log(`🚀  Server ready at: ${url}`);
  } catch (error) {
    console.error("Error starting server:", error);
  }
}

startServer();
