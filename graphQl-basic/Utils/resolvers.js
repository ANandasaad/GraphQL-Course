import { users,comment,posts } from "../config.js";
import User from "../src/schema/User.js";


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
    Mutation:{
      createUser(_,args,context,info){
        // const user = new User({

        // })
        console.log(args);


      }

    },
    Post: {
      author(parent, args, context, info) {
        return users.find((user) => {
          return user.id === parent.author;
        });
      },
      comments(parent,args,context,info){
          return comment.filter((comment)=>{
              return comment.post===parent.id
          })
  
      }
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
  
      },
  
    },
    Comment:{
      author(parent,args,context,info){
          return users.find((user)=>{
              return user.id===parent.author;
          })
      },
      post(parent,args,context,info){
          return posts.find((post)=>{
              return post.id===parent.post;
          })
      }
    }
    
  };

  export default resolvers;