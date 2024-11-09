const express = require("express");
const router = express.Router();
const Order = require("../models/order");
const User = require("../models/user");
const Item = require("../models/item");
const mongoose = require("mongoose");
const fetchuser = require("../middleware/fetchuser");


router.post("/create", async (req, res) => {
    try {
        const { itemId, orderedBy, orderQuantity, upiImage } = req.body;

        const newOrder = new Order({
            itemId,
            orderedBy,
            orderQuantity,
            upiImage,
            orderedAt: new Date()
        });

        await newOrder.save();
        res.json({ success: true, message: "Order created successfully", order: newOrder });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

router.get("/fetchorderbyid",fetchuser,async(req,res)=>{
    try {
        const userId=req.user.id;
        const orders=await Order.find({orderedBy: userId});
        return res.status(400).json(orders);
    } catch (error) {
        
    }
})

router.post("/updateorderstatus/:orderId", async (req, res) => {
    try {
        const { status, adminId } = req.body;
        const orderId = req.params.orderId;

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ success: false, error: "Order not found" });
        }

        order.status = status;
        order.approvalStatus = status;
        order.adminApproval = adminId;
        order.approvedAt = new Date();

        await order.save();
        res.json({ success: true, message: `Order ${status.toLowerCase()} successfully`, order });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

//...updated sale metrics...//
router.post("/updateordersales/:orderId", async (req, res) => {
    try {
        const orderId = req.params.orderId;

        const order = await Order.findById(orderId);
        if (!order || order.status !== "Approved") {
            return res.status(404).json({ success: false, error: "Approved order not found" });
        }

        // Update sales metrics
        order.deliveredAt = new Date();

        const now = new Date();
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        // Weekly and Monthly Sales for the specific item
        const weeklySales = await Order.countDocuments({
            itemId: order.itemId,
            deliveredAt: { $gte: startOfWeek }
        });
        const monthlySales = await Order.countDocuments({
            itemId: order.itemId,
            deliveredAt: { $gte: startOfMonth }
        });

        order.weeklySales = weeklySales;
        order.monthlySales = monthlySales;

        await order.save();
        res.json({ success: true, message: "Sales metrics updated", order });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});

///..get the sales metrics ...//
router.get("/ordersaleshow/:itemId", async (req, res) => {
    try {
        const { itemId } = req.params;
        
        const now = new Date();
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

        const weeklySales = await Order.countDocuments({
            itemId,
            deliveredAt: { $gte: startOfWeek }
        });

        const monthlySales = await Order.countDocuments({
            itemId,
            deliveredAt: { $gte: startOfMonth }
        });

        res.json({ success: true, weeklySales, monthlySales });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});


///.. delete order ...//
router.delete("/deleteorder/:orderId", fetchuser, async (req, res) => {
    try {
        const orderId = req.params.orderId;
        
        // Find the order first
        const order = await Order.findById(orderId);
        
        // Check if the order exists
        if (!order) {
            return res.status(404).json({ success: false, error: "Order not found" });
        }

        // Check if the logged-in user is the one who ordered
        if (req.user.id !== order.orderedBy.toString()) {
            return res.status(403).json({ success: false, error: "Unauthorized access" });
        }

        // Delete the order
        await Order.findByIdAndDelete(orderId);
        res.json({ success: true, message: "Order deleted successfully" });
        
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, error: "Internal Server Error" });
    }
});






module.exports=router