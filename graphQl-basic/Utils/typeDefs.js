
import gql from "graphql-tag";


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
    comments:[Comment!]!
  }

  type Comment{
  id:ID!
  textField:String!
  author:User!
  post:Post!
  }

  type Mutation{
  createUser(name:String!, email:String!, age:Int):User!
  createPost(title:String!,body:String!, published:String!, author:ID!):Post!
  createComment(textField:String!,author:ID!,post:ID!):Comment!
  }
`;

export default typeDefs;