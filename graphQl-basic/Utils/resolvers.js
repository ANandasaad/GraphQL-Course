import { users,comment,posts } from "../config.js";
import User from "../src/schema/User.js";
import { GraphQLError } from 'graphql';
import { v4 as uuidv4 } from 'uuid';



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
        const EmailTaken= users.some((user)=>user.email===args.email);
        if(EmailTaken)
        {
          throw new GraphQLError("Email is already exists",{
            extensions :{
            code: "EMAIL_ALREADY_USED"
            },
          } );
        }
        const user={
          id:uuidv4(),
         ...args
        }
      users.push(user);

      return user;
       

      },
      createPost(_,args,context,info){

        const titleTaken= posts.some((post)=>post.title===args.title);
        if(titleTaken)
        {
          throw new GraphQLError('Title is already exist',{
            extensions:{
              code: "TITLE_ALREADY_EXISTS",
            }
          })
        }
        const post={
          id:uuidv4(),
          ...args
        }
        // console.log(args);
        posts.push(post);
        return post;
      },
      createComment(_,args,context,info){
          const userTaken= comment.some((comment)=>comment.author===args.author);
          const postTaken= comment.some((comment)=>comment.post===args.post);
          if(userTaken || postTaken)
          {
            throw new GraphQLError("User is already exit",{
              extensions:{
                code :'USER_ALREADY_COMMENTED',
              }
            });
          }
          const comments={
            id:uuidv4(),
           ...args
          }

          comment.push(comments);
          return comments;
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