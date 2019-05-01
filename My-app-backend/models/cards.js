const mongoose = require("mongoose");

//Model for the card when on the database
const cardsSchema = new mongoose.Schema({
    card_number: Number,
    expiry_month: Number,
    expiry_year: Number,
    cvv: Number,
    balance: Number
});

module.exports = mongoose.model("Cards", cardsSchema);