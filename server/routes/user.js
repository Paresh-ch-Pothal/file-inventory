const express = require("express");
const app = express();
const User = require("../models/user");
const router = express.Router();
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");
const Depart = require("../models/department");
const JWT_SECRET = "^@12@34#%^&8@1%6$5^&#1234";


// ::: SignUp Routes
router.post("/signup", async (req, res) => {
    const { name, email, password, designation, typeofAuthenticator, departmentName, tenderType } = req.body;
    if (!name || !email || !password || !designation || !typeofAuthenticator) {
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
            name,
            email,
            password: hashedPassword,
            designation,
            typeofAuthenticator,
            departmentName,
            tenderType
        });

        // Fetch the department based on `typeofAuthenticator`
        let department;
        if (user.typeofAuthenticator === "Tender") {
            department = await Depart.findOne({ name: "Tender DepartMent" });
        } else if (user.typeofAuthenticator === "Admin") {
            department = await Depart.findOne({ name: "Admin DepartMent" });
        } else if (user.typeofAuthenticator === "Department") {
            department = await Depart.findOne({ name: departmentName });
        }

        // Add user to the department’s members and save
        if (department) {
            department.members.push(user._id);
            await department.save();
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



router.post("/signin", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, error: "Invalid Credentials" });
        }
        const compaarePassword = await bcrypt.compare(password, user.password);
        if (!compaarePassword) {
            return res.status(400).json({ success: false, error: "Please try with correct information" })
        }

        const payload = {
            user: {
                id: user._id,
                name: user.name
            }
        }

        const authtoken = JWT.sign(payload, JWT_SECRET);
        return res.json({ success: true, authtoken })
    } catch (error) {
        return res.status(500).send("Some internal issue is there")
    }
})


module.exports = router;