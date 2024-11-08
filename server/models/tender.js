const mongoose=require("mongoose");
const TenderSchema=new mongoose.Schema({
    description: {
        type: String,
    },
    status:{
        type: String,
        enum:["open","closed","awarded","cancelled"],
        default: "open",
        duedate:{
            type: Date
        }
    }
},{
    timestamps: true
})

const Tender=mongoose.model("tender",TenderSchema);
module.exports=Tender;