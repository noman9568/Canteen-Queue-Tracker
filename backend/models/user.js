const mongoose = require("mongoose");

let userSchema = new mongoose.Schema({
  name: { type :String , required: true },
  email: { type: String , required: true },
  userId : String,
  fcmtokens : { type: [String] , default : [] },
  password: String,
  role : { type: String , default: 'user' }
})

module.exports = mongoose.model("User",userSchema);