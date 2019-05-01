const mongoose = require("mongoose");

//Model for the suggestions when on the database
const suggesitionsSchema = new mongoose.Schema({
   title: {
      type: String
   },
   image: String,
   username: String,
   userid: String,
   productid: String
});

module.exports = mongoose.model("Suggestions", suggesitionsSchema);