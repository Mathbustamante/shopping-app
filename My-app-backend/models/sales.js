const mongoose = require("mongoose");

//Model for the sales when on the database
const salesSchema = new mongoose.Schema({
    product_id: String,
    quantity: Number,
    user_id: String
});

module.exports = mongoose.model("Sales", salesSchema);