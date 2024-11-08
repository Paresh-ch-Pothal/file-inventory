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

module.exports = router;
