const express=require("express");
const app = express();
const User = require("../models/user");
const router=express.Router();
const bcrypt=require("bcryptjs");
const JWT=require("jsonwebtoken");
const Depart = require("../models/department");
const JWT_SECRET="^@12@34#%^&8@1%6$5^&#1234";


// ::: SignUp Routes
router.post("/signup", async (req, res) => {
    const { name, email, password, designation, typeofAuthenticator, departmentName } = req.body;
    if (!name || !email || !password || !designation || !typeofAuthenticator || !departmentName) {
        return res.status(400).json({ success: false, error: "Please Provide All the Details" });
    }

    try {
        // Check if the user already exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ success: false, error: "User already exists with the same email" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // Create the user
        user = await User.create({
            name: name,
            email: email,
            password: hashedPassword,
            designation: designation,
            typeofAuthenticator: typeofAuthenticator,
            departmentName: departmentName // Store the department for the user
        });

        // Check if the user is HOD or not
        if (designation === "hod" || designation === "HOD") {
            // Find the department where the HOD should be added
            let depart = await Depart.findOne({ name: departmentName });

            if (depart) {
                // Push the new user's _id into the department's members array
                depart.members.push(user._id);
                
                // Set the new user as the admin of the department
                depart.admin = user._id;

                // Save the updated department
                await depart.save();
            } else {
                return res.status(400).json({ success: false, error: "Department not found" });
            }
        } else {
            // For users who are not HOD, simply add them to the members of the department
            let depart = await Depart.findOne({ name: departmentName });
            if (depart) {
                depart.members.push(user._id);  // Add the user to the department's members array
                await depart.save();
            } else {
                return res.status(400).json({ success: false, error: "Department not found" });
            }
        }

        // Generate JWT token
        const payload = {
            user: {
                _id: user._id,
                name: user.name
            }
        };
        const authtoken = JWT.sign(payload, JWT_SECRET);

        // Return success response with user and token
        return res.json({ success: true, user, authtoken });

    } catch (error) {
        console.log(error.message);
        res.status(500).send("Some Internal issue is there");
    }
});


router.post("/signin",async(req,res)=>{
    try {
        const {email,password}=req.body;
        const user=await User.findOne({email});
        if(!user){
            return res.status(404).json({success: false,error: "Invalid Credentials"});
        }
        const compaarePassword=await bcrypt.compare(password,user.password);
        if(!compaarePassword){
            return res.status(400).json({success: false,error: "Please try with correct information"})
        }

        const payload={
            user:{
                id: user._id,
                name: user.name
            }
        }

        const authtoken=JWT.sign(payload,JWT_SECRET);
        return res.json({success: true,authtoken})
    } catch (error) {
        return res.status(500).send("Some internal issue is there")
    }
})


module.exports=router;