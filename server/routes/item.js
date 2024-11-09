const mongoose=require("mongoose");
const express=require("express");
const Item = require("../models/item");
const router=express.Router();

router.post("/itemcreate",async(req,res)=>{
    const {name,type}=req.body;
    let item=await Item.create({
        name: name,
        type: type
    })
    return res.status(400).json({item});
})

module.exports=router;