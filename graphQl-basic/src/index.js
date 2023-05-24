import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import gql from "graphql-tag";
import mongoose from "mongoose";
import { MONGO_URL } from "../config.js";
import User from "./schema/model.js";

const users = [
  {
    id: "1",
    name: "Anand",
    email: "anandkushwaha70@gmail.com",
    age: 24,
  },
  {
    id: "2",
    name: "Aditya",
    email: "aditya70@gmail.com",
    age: 15,
  },
];

const posts = [
  {
    id: "12",
    title: "A book",
    body: "This is my Story",
    published: "1/2/2002",
    author: "1",
  },
  {
    id: "121",
    title: "A Women",
    body: "The Mother",
    published: "1/2/1900",
    author: "2",
  },
];

const comment =[{
    id:'2',
    textField:'Nice Book',
    author:'1'
},{
    id:'3',
    textField:"Amazing Movie",
    author:'2'
}]

// Type Definition
const typeDefs = gql`
  type Query {
    greeting(name: String!): String!
    add(number: [Int!]): Int!
    grade: [Int!]!
    hello: String!
    name: String!
    age: Int!
    user: User
    post: [Post!]!
    me(query: String): [User!]!
    comments:[Comment!]!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    posts: Post!
    comments:[Comment!]!
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: String!
    author: User!
  }

  type Comment{
  id:ID!
  textField:String!
  author:User!
  }
`;

// resolvers

const resolvers = {
  Query: {
    greeting: (_, args, context, info) => {
      const { name } = args;
      if (name) {
        return `${name} Hello`;
      } else {
        return "Hello";
      }
    },
    add: (_, args, context, info) => {
      const { number } = args;
      console.log(number);
      if (number.length === 0) {
        return 0;
      } else {
        return number.reduce((acc, curr) => {
          return acc + curr;
        });
      }
    },
    grade: (_, args, context, info) => {
      return [99, 23, 12, 1213, 123];
    },
    hello: () => {
      return "this is my first query";
    },
    name: () => {
      return "Anand";
    },
    age: () => {
      return 34;
    },
    user: () => {
      return {
        id: "1234",
        name: "Anand",
        email: "anandKushwaha70@gmail.com",
        age: 24,
      };
    },
    post: () => {
      return {
        id: "231",
        title: "A Book",
        body: "This is my Story",
        published: "12/1/2001",
      };
    },
    me: (_, args, context, info) => {
      if (!args.query) {
        return users;
      }

      return users.filter((user) => {
        return user.name.toLowerCase().includes(args.query.toLowerCase());
      });
    },

    post: (_, args, context, info) => {
      return posts;
    },
    comments:()=>{
        return comment;
    }
  },
  Post: {
    author(parent, args, context, info) {
      return users.find((user) => {
        return user.id === parent.author;
      });
    },
  },
  User: {
    posts(parent, args, context, info) {
      return posts.filter((post) => {
        return post.author === parent.id;
      });
    },
    comments(parent,args,context,info){
        return comment.filter((comment)=>{
            return comment.author===parent.id;
        })

    }
  },
  Comment:{
    author(parent,args,context,info){
        return users.find((user)=>{
            return user.id===parent.author;
        })
    }
  }
  
};

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
