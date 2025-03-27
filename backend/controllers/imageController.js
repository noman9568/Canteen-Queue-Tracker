const dish = require('../models/dish');

const uploadDish = async (req,res) =>{
  try {
    const Image = new dish({
      name : req.body.name,
      price : req.body.price,
      quantity : req.body.quantity,
      image : {
        data : req.file.buffer,
        contentType : req.file.mimetype,
      },
      category : req.body.category,
    });
    // console.log(req.body);
    await Image.save();
    res.status(200).json({message : "Data uploaded successfully!"});
  }
  catch(error) {
    res.status(500).json({error : "Error in saving the data!"});
  }
}
const dishData = async (req,res) =>{
  try {
    const data = await dish.find();
    res.status(200).json({data:data});
  }
  catch(error) {
    res.status(404).json({message : "Error in fetching the data."});
  }
}

module.exports = {uploadDish , dishData};

