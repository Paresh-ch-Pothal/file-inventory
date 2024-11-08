const mongoose=require("mongoose");
const User = require("./user");
const departSchema=new mongoose.Schema({
    name:{
        type: String,
    },
    members:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: User
        }
    ],
    admin:{
        type: mongoose.Schema.Types.ObjectId,
        ref: User
    }

},{
    timestamps: true,
})

const Depart=mongoose.model("department",departSchema);
module.exports=Depart;