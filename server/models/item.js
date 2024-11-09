const mongoose = require("mongoose");
const User = require("./user");

const ItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ["Necessary", "General"], // Types of items (Necessary/General)
        required: true,
    },
}, {
    timestamps: true,
});

const Item = mongoose.model("Item", ItemSchema);
module.exports = Item;
