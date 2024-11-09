const mongoose = require("mongoose");
const Item = require("./item");
const User = require("./user");

const OrderSchema = new mongoose.Schema({
    itemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Item,
        required: true,
    },
    orderedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User, 
        required: true,
    },
    orderQuantity: {
        type: Number,
        required: true,
    },
    upiImage: {
        type: String,
    },
    status: {
        type: String,
        enum: ["Pending", "Approved", "Rejected"],
        default: "Pending",
    },
    approvalStatus: {
        type: String,
        enum: ["Approved", "Rejected", "Pending"],
        default: "Pending",
    },
    adminApproval: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User, 
    },
    monthlySales: {
        type: Number,
        default: 0,
    },
    weeklySales: {
        type: Number,
        default: 0,
    },
    deliveryDate: {
        type: Date,
    },

    //for tracking
    orderedAt: {
        type: Date, 
    },
    approvedAt: {
        type: Date, 
    },
    deliveredAt: {
        type: Date,
    }

}, {
    timestamps: true,
});

const Order = mongoose.model("Order", OrderSchema);
module.exports = Order;
