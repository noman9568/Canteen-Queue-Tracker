const mongoose = require('mongoose');

const dishSchema = mongoose.Schema({
  name : String,
  price : Number,
  quantity : Number,
  image : {  data: Buffer , contentType : String },
  category : String,
});

module.exports = mongoose.model("Dish",dishSchema);