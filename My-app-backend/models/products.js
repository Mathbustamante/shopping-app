const mongoose = require("mongoose");

//Model for the products when on the database
const productsSchema = new mongoose.Schema({
   title: {
      type: String
   },
   image: String,
   price: Number,
   info: String,
   category: String,
   user: String
});

module.exports = mongoose.model("Products", productsSchema);