const express=require("express");
const File = require("../models/file");
const fetchuser = require("../middleware/fetchuser");
const Depart = require("../models/department");
const User = require("../models/user");
const router=express.Router();


router.post("/", fetchuser, async (req, res) => {
    const { title, description, fileDetails } = req.body;

    if (!fileDetails || !Array.isArray(fileDetails)) {
        return res.status(400).json({ success: false, error: "fileDetails should be an array" });
    }

    // Ensure that each fileDetails object is properly formatted
    const formattedFileDetails = fileDetails.map(detail => {
        return {
            fileName: detail.fileName,
            fileType: detail.fileType,
            fileUrl: detail.fileUrl,
            uploadDate: detail.uploadDate,
            message: detail.message
        };
    });

    try {
        const file = await File.create({
            title,
            description,
            owner: req.user.id,
            fileDetails: formattedFileDetails
        });

        await file.save();

        return res.status(200).json({ success: true, file });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});



///... showing all the file of a owner matlab jo wo sabhi send kiya hai...//
router.get("/fileofowner",fetchuser,async(req,res)=>{
    const ownerId=req.user.id;
    const filesofowner=await File.find({owner: ownerId}).populate("owner").populate("movementhistory.movedTo");
    return res.status(200).json({success: true,filesofowner}) ;
})

///... delete a file ..//
router.get("deletefile/:fileid",fetchuser,async(req,res)=>{
    const ownerId=req.user._id;
    let file=await File.findByIdAndDelete(ownerId);
    return res.json.status(200).json({success: true,file});
}) 

//...move a file..//
router.post("/move/:fileId", fetchuser, async (req, res) => {
    const { fileId } = req.params;
    const { departmentId, memberId } = req.body;  // Changed to match the keys you provided

    try {
        if (!req.user) {
            return res.status(401).json({ success: false, error: "User not authenticated" });
        }

        const file = await File.findById(fileId);
        if (!file) {
            return res.status(404).json({ success: false, error: "File not found" });
        }

        if (file.owner.toString() !== req.user.id) {
            return res.status(403).json({ success: false, error: "You are not authorized to move this file" });
        }

        // Validate department and member IDs
        const targetDepartment = await Depart.findById(departmentId);
        const targetMember = await User.findById(memberId);

        if (!targetDepartment) {
            return res.status(404).json({ success: false, error: "Target department not found" });
        }
        if (!targetMember) {
            return res.status(404).json({ success: false, error: "Target member not found" });
        }

        // Update file with new department and member
        file.assignedTo = memberId;

        // Add movement history entry
        file.movementhistory.push({
            fromdepart: file.department,
            todepart: departmentId,
            movedBy: req.user.id,
            movedTo: memberId,
            dateMoved: Date.now(),
            statusMove: "In progress"
        });

        // Save the updated file
        await file.save();

        return res.status(200).json({ success: true, file });

    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

//.. assigned files ..//
// Route to get all files assigned to the authenticated user
router.get("/assignedfiles", fetchuser, async (req, res) => {
    try {
        const assignedFiles = await File.find({ assignedTo: req.user.id })
            .populate("department", "name")
            .populate("owner", "name email")
            .populate("movementhistory.movedBy", "name")
            .populate("movementhistory.movedTo", "name");

        if (!assignedFiles || assignedFiles.length === 0) {
            return res.status(404).json({ success: false, message: "No files assigned to you" });
        }
        return res.status(200).json({ success: true, assignedFiles });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

//... when he clicks to status ...//
router.post("/changefilestatus/:fileId", fetchuser, async (req, res) => {
    try {
        const { fileId } = req.params;

        // Find the file by ID
        const file = await File.findById(fileId);

        // Check if file exists
        if (!file) {
            return res.status(404).json({ success: false, error: "File not found" });
        }

        // Check if the logged-in user is authorized to change the file status
        if (file.assignedTo.toString() !== req.user.id) {
            return res.status(403).json({ success: false, error: "You are not authorized to change the status of this file" });
        }

        // Update the file status to "Completed"
        file.status = "Completed";

        // Update the last entry in movement history to "Completed"
        file.movementhistory.forEach(file => {
            if (file.movedTo == req.user.id){
                file.statusMove = "Completed"
            }
        });

        // Save the changes
        await file.save();

        return res.status(200).json({ success: true, message: "File status updated to Completed", file });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});








module.exports=router;