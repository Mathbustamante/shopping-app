const mongoose = require("mongoose");

//Model for the wishlist when on the database
const wishlistsSchema = new mongoose.Schema({
    //product_id: {type: mongoose.Schema.Types.ObjectId, ref: 'Products'},
    product_id: String,
    user_id: String
});

module.exports = mongoose.model("Wishlists", wishlistsSchema);