const mongoose = require("mongoose");

//Model for the cart when on the database
const cartsSchema = new mongoose.Schema({
    title: {
        type: String
    },
    image: String,
    price: Number,
    info: String,
    id: String,
    userid: String,
    quantity: Number
});

module.exports = mongoose.model("Carts", cartsSchema);