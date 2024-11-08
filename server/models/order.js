const mongoose=require("mongoose");
const OrderSchema=new mongoose.Schema({
    orderDate:{
        type: Date,
        default: Date.now()
    },
    quantityOrdered:{
        type: Number
    },
    status:{
        type: String,
        enum:["Ordered","Received","BackOrdered"],
        default: "Ordered"
    },
    expectedDelivery:{
        type: Date
    }
},{
    timestamps: true
})

const Order=mongoose.model("order",OrderSchema);
module.exports=Order;