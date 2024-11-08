const express=require("express");
const File = require("../models/file");
const fetchuser = require("../middleware/fetchuser");
const Depart = require("../models/department");
const User = require("../models/user");
const router=express.Router();


module.exports=router