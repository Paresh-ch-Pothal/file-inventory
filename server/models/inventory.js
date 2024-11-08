const mongoose=require("mongoose");
const Order = require("./order");
const Tender = require("./tender");
const InventorySchema=new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    description:{
        type: String,
    },
    quantity:{
        type:Number,
        required: true,
        default: 0
    },
    supply:[
        {
            sname:{
                type: String,
                required: true,
            },
            dateofSupply:{
                type: Date
            }
        }
    ],
    purchaseOrders:[{
        type: mongoose.SchemaTypes.ObjectId,
        ref: Order
    }],
    tenderStatus:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: Tender
        }
    ],
    backorder:{
        type: Boolean,
        default: false
    },

},{
    timestamps: true,
})

const Inventory=mongoose.model("inventory",InventorySchema);
module.exports=Inventory;