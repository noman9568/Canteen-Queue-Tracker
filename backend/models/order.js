const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  userId: { type : String, ref : "User" , required : true },
  items : [
    {
      dishId : { type : mongoose.Schema.Types.ObjectId , ref : "Dish", required : true },
      name : { type : String, required : true },
      quantity : { type : String, required : true },
      price : { type : String, required : true },
    }
  ],
  totalAmount : { type : Number , required : true },
  status: { type: String, enum: ['Pending', 'Completed'], default: 'Pending' },
  createdAt: { type: Date, default: Date.now }
})

module.exports = mongoose.model("Order",orderSchema);
