
import mongoose from "mongoose";
import User from "./User";
import Comment from "./Comment";

const postSchema= new mongoose.Schema({
    title:String,
    body:String,
    published:{type :Date, default:Date.now},
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:User
    },
    comments:{
        type:mongoose.Schema.Types.ObjectId,
        ref:Comment
    }
})

const Post= mongoose.model('Post',postSchema);
export default Post;