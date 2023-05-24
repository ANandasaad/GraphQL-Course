import {ApolloServer} from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import gql from 'graphql-tag';
import mongoose from 'mongoose';
import { MONGO_URL } from '../config.js';
import User from './schema/model.js';
// Type Definition
 const typeDefs=gql`
  

     type Query{
    hello:String!
     name:String!
     age:Int!
     user:User
     }

     type User{
     id:ID!
     name:String!
     email:String!
     age:Int
     
     }
 `



// resolvers

const resolvers={
    Query:{
       hello:()=>{
        return "this is my first query"
       },
       name:()=>{
        return "Anand"
       },
       age:()=>{
        return 34
       },
       user:()=>{
          return {
            id:'1234',
            name:"Anand",
            email:"anandKushwaha70@gmail.com",
            age:24
          }
       }

    }
}

const server= new ApolloServer({
    typeDefs,
    resolvers
})


mongoose.connect(MONGO_URL,{useNewUrlParser:true}).then(()=>{
    console.log("MongoDb connnection is Successful");
    return startStandaloneServer(server,{
        listen:{
            port:4000
        }
    })
}).then((res)=>{
     console.log("server is running at "+res.url);
}).catch((error)=>{
    console.log(error);
})


