const Queue = require('../models/queue');
const User = require('../models/user');
const Order = require('../models/order');
const admin = require("firebase-admin");
const mongoose = require("mongoose");

const startOfDay = new Date();
startOfDay.setHours(0, 0, 0, 0);

const endOfDay = new Date();
endOfDay.setHours(23, 59, 59, 999);

exports.joinQueue = async (req,res) =>{
  const { userId , fcmtoken } = req.body;

  const user = await User.findById(userId);

  const totalOrders = await Order.countDocuments();
  const orderNo = totalOrders + 1;
  const completedOrdersToday = await Order.find({
    status: "Completed",
    createdAt: { $gte: startOfDay, $lte: endOfDay }
  });
  const numberOrders = completedOrdersToday.length;
  const todayAmount = completedOrdersToday.reduce((sum, order) => {
    return sum + order.totalAmount;
  }, 0);


  const newUser = await Queue.create({orderNo , userId , name : user.name , fcmtoken });
  const newUserWithOrders = await Queue.findById(newUser._id).populate('orders');

  const io = req.app.get("io");
  io.emit('updatedQueue',await Queue.find().populate('orders'));
  res.status(200).json(newUserWithOrders);
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
  const completedOrdersToday = await Order.find({
    status: "Completed",
    createdAt: { $gte: startOfDay, $lte: endOfDay }
  });
  const numberOrders = completedOrdersToday.length;
  const todayAmount = completedOrdersToday.reduce((sum, order) => {
    return sum + order.totalAmount;
  }, 0);
  try {
    const data = await Queue.find().populate('orders');
    return res.status(200).json({ data,numberOrders,todayAmount });
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
    console.log("Response from the notification -  " ,response);
    res.status(200).json({ success: true, response });
  } catch (error) {
    console.error("Notification error:", error);
    res.status(500).json({ error: error.message });
  }
}



// module.exports = { joinQueue,saveToken };