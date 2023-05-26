import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import mongoose from "mongoose";
import { MONGO_URL } from "../config.js";
import typeDefs from "../Utils/typeDefs.js";
import resolvers from "../Utils/resolvers.js";
import { PubSub } from "graphql-subscriptions";
import {createServer} from 'http';
import { makeExecutableSchema } from "@graphql-tools/schema";
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { expressMiddleware } from '@apollo/server/express4';



// Create the schema, which will be used separately by ApolloServer and
// the WebSocket server.





const schema =makeExecutableSchema({typeDefs,resolvers});

// Create an Express app and HTTP server; we will attach both the WebSocket
// server and the ApolloServer to this HTTP server.
const app=express();
const httpServer= createServer(app);

// Create our WebSocket server using the HTTP server we just set up.

const wsServer= new WebSocketServer({
  server:httpServer,
  path:'/graphql'
});

// Save the returned server's info so we can shutdown this server later

const serverCleanup= useServer({schema},wsServer);

// Set up ApolloServer.

const server= new ApolloServer({
  schema,
  plugins:[
    // Proper shutdown for the HTTP server.
    ApolloServerPluginDrainHttpServer({httpServer}),

  // Proper shutdown for the WebSocket server.
  {
    async serverWillStart(){
      return {
        async drainServer(){
          await serverCleanup.dispose();
        }
      }
    }
  }

  ]
});


await server.start();
app.use('/graphql',cors(),bodyParser.json(),expressMiddleware(server));
const PORT=5000;

mongoose.connect(MONGO_URL,{useNewUrlParser:true}).then(()=>{
  console.log("MongoDB is Connected");
  return httpServer.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}/graphql`);
  })
    
}).catch((error)=>{
  console.log(error);
})









// const pubsub= new PubSub();
// const server = new ApolloServer({
//   typeDefs,
//   resolvers,
//   context:{
//     pubsub
//   }
// });



// mongoose
//   .connect(MONGO_URL, { useNewUrlParser: true })
//   .then(() => {
//     console.log("MongoDb connnection is Successful");
//     return startStandaloneServer(server, {
//       listen: {
//         port: 4000,
//       },
//     });
//   })
//   .then((res) => {
//     console.log("server is running at " + res.url);
//   })
//   .catch((error) => {
//     console.log(error);
//   });
