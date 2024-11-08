const mongoose=require("mongoose");

const connectToMongoDB=async()=>{
    return(
        await mongoose.connect("mongodb://localhost:27017/fileinventory").then(()=>{
            console.log("Mongodb is connected Successfully")
        }).catch(()=>{
            console.log("MongoDb is not Connected")
        })
    )
}

module.exports={connectToMongoDB};