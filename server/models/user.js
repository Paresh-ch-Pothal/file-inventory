const mongoose=require("mongoose");
const UserSchema=new mongoose.Schema({
    name:{
        type: String,
        required: true,
    },
    designation:{
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    departmentName:{
        type: String,
        enum:["CSE","IT","EEE","ETC","CE"]
    },
    tenderType:{
        type: String,
    },
    typeofAuthenticator:{
        type: String,
        enum:["Department","Tender","Admin"]
    },
},{
    timestamps: true,
})

const User=mongoose.model("user",UserSchema);
module.exports=User;