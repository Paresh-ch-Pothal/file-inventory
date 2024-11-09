const bodyParser = require("body-parser");
const express=require("express");

// .... routes ....//
const userRoutes=require("./routes/user");
const fileRoutes=require('./routes/file');
const departRoutes=require('./routes/department');
const orderRoutes=require('./routes/order');
const itemRoutes=require('./routes/item');



const {connectToMongoDB}=require("./connectdb");
const app=express();
app.use(bodyParser.json());
app.use(express.urlencoded({extended:  true}));
connectToMongoDB();
const port=5000;


app.use("/user",userRoutes);
app.use("/file",fileRoutes);
app.use("/depart",departRoutes);
app.use("/order",orderRoutes);
app.use("/item",itemRoutes);

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})




module.exports = app;