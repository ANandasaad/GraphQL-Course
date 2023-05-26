import { users,comment,posts } from "../config.js";
import User from "../src/schema/User.js";
import { GraphQLError } from 'graphql';
import { v4 as uuidv4 } from 'uuid';
import { PubSub } from "graphql-subscriptions";
import Message from "../src/schema/Message.js";
import Order from "../src/schema/Order.js";

const pubsub= new PubSub();
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
      user: async () => {
        try{
          const res= await User.find().exec();
          console.log(res +"Result");
          return res;
        }
        catch(error){
          console.log(error);
          throw new GraphQLError(`Error ${error}`,{
            extensions:{
              code:"ERROR_"
            }
          })
        }
       
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
      },
      message:()=>{
       const mes= Message.find();
        return mes;

      }
    },
    Mutation:{
      createUser:async(_,args,context,info)=>{
        const EmailTaken= users.some((user)=>user.email===args.input.email);
        if(EmailTaken)
        {
          throw new GraphQLError("Email is already exists",{
            extensions :{
            code: "EMAIL_ALREADY_USED"
            },
          } );
        }
        else{
          const newUser= new User({
            name:args.input.name,
            email:args.input.email,
            age:args.input.age
          })
  
          const res= await newUser.save();
          return {
            id:res.id,
            ...res._doc
          }
        }

       

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
      },
      deleteUser:(_,args,context,info)=>{
        const userIndex=users.findIndex((user)=>{
          return user.id===args.id
        })

        if(userIndex==-1){
            throw new GraphQLError('User not found',{
              extensions:{
                code:'USER_NOT_FOUND',
              }
            })
        }
          const deletedUser= users.splice(userIndex,1);
          posts=posts.filter((post)=>{
           const match = post.author===args.id
           if(match){
            comment=comment.filter((comment)=>{
              comment.post!==post.id
            })
           }
           return !match;
          }) 
          comment=comment.filter((comment)=>{
            comment.author!==args.id
          })

          return deletedUser[0];
        
      }
      ,
      updateUser:(_,args,context,info)=>{
        const {id,input}=args;
        const user=users.find((user)=>user.id===id)

        if(!user)
        {
          throw new GraphQLError("User not Found",{
            extensions:{
              code:"USER_NOT_FOUND"
            }
          })
        }

        if(typeof input.email ==='string')
        {
          const emailTaken= users.some((user)=> user.email ===input.email)

          if(emailTaken)
          {
            throw new GraphQLError("Email is already exist",{
              extensions:{
                code:"EMAIL_IS_ALREADY_EXIST"
              }
            })
          }

          user.email=input.email
        }

        if(typeof input.name==="string")
        {
          user.name=input.name
        }

        if(typeof input.age!=='undefined')
        {
          user.age=input.age
        }

        return user;
      },
      createMessage: async (_,args)=>{
        // console.log("text"+ args.input.text);
        
        const newMessage = new Message({
          text:args.input.text,
          createdBy:args.input.username
        });

  
        const res= await newMessage.save();
        pubsub.publish('MESSAGE_CREATED',{
          messageCreated:{
            text:args.input.text,
            createdBy:args.input.username
          }
        })
  
        return {
          id:res.id,
          ...res._doc
        }
  
   
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
    ,
    Subscription:{
      messageCreated:{
       subscribe:()=>{
        return  pubsub.asyncIterator(['MESSAGE_CREATED'])
       }
      }
 }
    
  };

  export default resolvers;