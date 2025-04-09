const Queue = require('../models/queue');
const User = require('../models/user');
const Order = require('../models/order');
const admin = require("firebase-admin");


exports.joinQueue = async (req,res) =>{
  const { userId , fcmtoken } = req.body;
  const user = await User.findOne({ _id : userId });
  const name = user.name;
  // console.log(user);
  const newUser = await Queue.create({userId , name , fcmtoken});
  res.status(200).json(newUser)
};

exports.saveToken = async (req,res) =>{
  try{
    const {userId , token } = req.body;
    const updatedUser = await User.findOneAndUpdate(
      { _id : userId },
      { $addToSet : {fcmtokens : token} },
      { new : true }
    )
    // console.log(updatedUser)
    const updatedQueue = await Queue.findOneAndUpdate({userId} , {token} , {new : true});
    res.status(200).json({
      message: "FCM Token saved!",
      user: updatedUser,
      queue: updatedQueue
    });
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
    const order = await Order.findOneAndUpdate({userId},{status : "Completed"},{new : true});
    // console.log(order);
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
  const { title , body , tokens } = req.body;
  // console.log("Token from the user - ",tokens);
  const message = {
    notification : {
      title,
      body,
    },
    tokens : tokens
  };
  try {
    const response = await admin.messaging().sendEachForMulticast(message);
    res.status(200).json({ success: true, response });
  } catch (error) {
    console.error("Notification error:", error);
    res.status(500).json({ error: error.message });
  }
}



// module.exports = { joinQueue,saveToken };