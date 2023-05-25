import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import mongoose from "mongoose";
import { MONGO_URL } from "../config.js";
import typeDefs from "../Utils/typeDefs.js";
import resolvers from "../Utils/resolvers.js";

// Type Definition

// resolvers

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

mongoose
  .connect(MONGO_URL, { useNewUrlParser: true })
  .then(() => {
    console.log("MongoDb connnection is Successful");
    return startStandaloneServer(server, {
      listen: {
        port: 4000,
      },
    });
  })
  .then((res) => {
    console.log("server is running at " + res.url);
  })
  .catch((error) => {
    console.log(error);
  });
