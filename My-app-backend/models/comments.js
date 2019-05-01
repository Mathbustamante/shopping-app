var mongoose = require("mongoose");

//Model for the comments when on the database
var commentSchema = mongoose.Schema({
    text: String,
    author: String,
    userid: String,
    productid: String
});

module.exports = mongoose.model("Comment", commentSchema);