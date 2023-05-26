import mongoose from "mongoose";
const messageSchema= new mongoose.Schema({
    text:String,
    createdBy:String
})

const Message= mongoose.model("Message",messageSchema);

export default Message;