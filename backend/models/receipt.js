const mongoose = require("mongoose");

const receipt = mongoose.Schema({
  userId : { type : String , required : true},
  payId : { type : String , required : true },
  orderId : { type : String , required : true },
  totalAmount : { type : String , required : true }
});

module.exports = mongoose.model("receipt",receipt);