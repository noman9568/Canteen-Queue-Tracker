const Queue = require('../models/queue');
const User = require('../models/user');
const Order = require('../models/order');
const admin = require("firebase-admin");
const mongoose = require("mongoose");


exports.joinQueue = async (req,res) =>{
  const { userId , fcmtoken } = req.body;
  const user = await User.findOne({ _id : userId });
  const name = user.name;
  const newUser = await Queue.create({userId , name , fcmtoken});

  const io = req.app.get("io");
  io.emit('updatedQueue',await Queue.find());
  res.status(200).json(newUser)
};

exports.saveToken = async (req,res) =>{
  try{
    const {userId , token } = req.body;
    const updatedUser = await User.findOneAndUpdate(
      { _id : userId },
      { fcmtokens : [token] },
      { new : true }
    )

    const updatedQueue = await Queue.findOneAndUpdate({userId} , {token} , {new : true});
    res.status(200).json({ message: "FCM Token saved!" });
  }
  catch(error){
    res.status(500).json({message : "Error while saving the token - ", error : error.message})
  }
};

exports.getQueue = async (req,res) =>{
  try {
    const data = await Queue.find();
    return res.status(200).json(data);
  }
  catch (err) {
    console.log("Error in fetching the queue data - ",err);
  }
}

exports.deleteQ = async (req,res) =>{
  try {
    const { _id , userId } = req.body;
    const objectUserId = new mongoose.Types.ObjectId(userId);
    const order = await Order.findOneAndUpdate({userId : objectUserId},{status : "Completed"},{ new: true, sort: { createdAt: -1 } });
    const data = await Queue.findByIdAndDelete({_id});
    const io = req.app.get("io");
    io.emit('updatedQueue',await Queue.find());
    return res.status(200).json({message : "User removed from Queue."});
  }
  catch(err) {
    console.log("Error in notifying the user - ",err);
  }
}

exports.notify = async (req,res) =>{
  const { title , body , token } = req.body;
  // console.log(req.body);
  const message = {
    notification : {
      title,
      body,
    },
    token
  };
  try {
    const response = await admin.messaging().send(message);
    // console.log("Response from the notification -  " ,response);
    res.status(200).json({ success: true, response });
  } catch (error) {
    console.error("Notification error:", error);
    res.status(500).json({ error: error.message });
  }
}



// module.exports = { joinQueue,saveToken };