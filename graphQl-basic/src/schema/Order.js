import mongoose from "mongoose";

const orderSchema= new mongoose.Schema({
    item:Number
})

const Order= mongoose.model("Order",orderSchema);
export default Order;