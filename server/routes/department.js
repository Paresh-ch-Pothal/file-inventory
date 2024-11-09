const express = require('express');
const router = express.Router();
const Depart = require('../models/department'); // Assuming your department model is located in '../models/department'

// POST route to create a new department without admin initially
router.post('/createDepartment', async (req, res) => {
    const { name } = req.body; // Only department name will be provided

    // Validate input
    if (!name) {
        return res.status(400).json({ success: false, error: "Please provide a department name" });
    }

    try {
        // Check if the department already exists
        let department = await Depart.findOne({ name });
        if (department) {
            return res.status(400).json({ success: false, error: `Department with name ${name} already exists` });
        }

        // Create a new department with the provided name
        department = await Depart.create({
            name: name, // Department name like 'CSE', 'EEE', 'IT', 'CE'
            members: []  // Initial empty array of members
        });

        return res.status(201).json({ success: true, department });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Server Error");
    }
});

router.get("/tenderadmin", async (req, res) => {
    try {
        // Find Tender Department and Admin Department and populate members
        const tenderDepartment = await Depart.findOne({ name: "Tender DepartMent" })
            .populate("members", "name email designation");  // Populate specific fields if needed
        
        const adminDepartment = await Depart.findOne({ name: "Admin DepartMent" })
            .populate("members", "name email designation");

        // Check if departments exist
        if (!tenderDepartment || !adminDepartment) {
            return res.status(404).json({ success: false, error: "Departments not found" });
        }

        // Return both departments' details
        return res.json({
            success: true,
            tenderDepartment: tenderDepartment.members,
            adminDepartment: adminDepartment.members
        });
        
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ success: false, error: "Internal server error" });
    }
});


/// .. what the department sees ..///
router.get("/departadmin", async (req, res) => {
    try {
        // Fetch all departments (including Admin, CSE, IT, CE, etc.)
        const allDepartments = await Depart.find()
            .populate("members", "name email designation");  // Populate members with selected fields

        // Filter out the Tender Department from the departments array
        const filteredDepartments = allDepartments.filter(dept => dept.name !== "Tender DepartMent");

        // Return the filtered list of departments, excluding Tender Department
        return res.json({
            success: true,
            departments: filteredDepartments,  // All departments except Tender Department
        });
        
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ success: false, error: "Internal server error" });
    }
});


///.. what the admin sees ...///
router.get("/admin", async (req, res) => {
    try {
        // Fetch all departments (including Admin, CSE, IT, CE, etc.)
        const allDepartments = await Depart.find()
            .populate("members", "name email designation"); 
        return res.json({
            success: true,
            departments: allDepartments, 
        });
        
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ success: false, error: "Internal server error" });
    }
});



module.exports = router;
