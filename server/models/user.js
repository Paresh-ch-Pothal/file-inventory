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
        required: true
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