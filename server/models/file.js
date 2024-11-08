const mongoose=require("mongoose");
const User = require("./user");
const Depart = require("./department");
const FileSchema=new mongoose.Schema({
    title:{
        type: String,
    },
    description:{
        type: String,
    },
    department:{
        type: mongoose.Schema.Types.ObjectId,
        ref: Depart,
    },
    status:{
        type: String,
        enum:["Pending","In progress","Completed"],
        default: "Pending"
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User
    },
    fileDetails: [{
        fileName: {
            type: String,
        },
        fileType: {
            type: String,
            enum: ['doc', 'pdf', 'xlsx', 'ppt', 'txt', 'other'],
            required: true
        },
        fileUrl: {
            type: String,
            required: true
        },
        uploadDate: {
            type: Date,
            default: Date.now
        },
        message:{
            type: String,
        }
    }],
    movementhistory:[
        {
            fromdepart:{
                type: mongoose.Schema.Types.ObjectId,
                ref: Depart,
            },
            todepart:{
                type: mongoose.Schema.Types.ObjectId,
                ref: Depart,
            },
            movedBy:{
                type: mongoose.Schema.Types.ObjectId,
                ref: User,
            },
            movedTo:{
                type: mongoose.Schema.Types.ObjectId,
                ref: User,
            },
            dateMoved:{
                type: Date,
                default: Date.now(),
            },
            statusMove:{
                type: String,
                enum: ["Pending","In progress","Completed"],
                default: "Pending",
            }
        }
    ]

},{
    timestamps: true,
})

const File=mongoose.model("file",FileSchema);
module.exports=File;