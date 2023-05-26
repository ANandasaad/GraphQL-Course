
import gql from "graphql-tag";


const typeDefs = gql`
  type Query {
    greeting(name: String!): String!
    add(number: [Int!]): Int!
    grade: [Int!]!
    hello: String!
    name: String!
    age: Int!
    user: User!
    post: [Post!]!
    me(query: String): [User!]!
    comments:[Comment!]!
    message(id:ID):Message
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
    comments:[Comment!]!
  }

  type Comment{
  id:ID!
  textField:String!
  author:User!
  post:Post!
  }

  type Mutation{
  createUser(input:createUserInput):User!
  createPost(title:String!,body:String!, published:String!, author:ID!):Post!
  createComment(textField:String!,author:ID!,post:ID!):Comment!
  deleteUser(id:ID!):User!
  updateUser(id:ID!, input:updateUserInput):User!
  createMessage(input:createMessageInput):Message!
  }
  input createUserInput{
  name:String!
  email:String!
  age:Int
  }
  input updateUserInput{
  name:String
  email:String
  age:Int
  }


  type Subscription{
    messageCreated:Message
  }

  type Message{
  text:String!
  createdBy:String!
  }
  input createMessageInput{
  text:String
  username:String
  }
`;

export default typeDefs;