import mongoose from "mongoose";
import User from "./User";

const commentSchema= new mongoose.Schema({
    textField:String,
   

})

const Comment= mongoose.model('Comment',commentSchema);
export default Comment;