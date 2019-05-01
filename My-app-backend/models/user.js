const mongoose = require("mongoose");

//Model for the user when on the database
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
   email: {
       type: String, 
       required: true, 
       unique: true
   },
   password: {
       type: String,
       required: true
   }
});


module.exports = mongoose.model("Users", UserSchema);