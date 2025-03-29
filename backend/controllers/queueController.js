const Queue = require('../models/queue');
const User = require('../models/user');


exports.joinQueue = async (req,res) =>{
  const { userId , fcmtoken } = req.body;
  // console.log(req.body);
  const user = await User.findOne({ _id : userId });
  const name = user.name;
  // console.log(user);
  const newUser = await Queue.create({userId , name , fcmtoken});
  res.status(200).json(newUser)
};

exports.saveToken = async (req,res) =>{
  try{
    const {userId , fcmtoken } = req.body;
    // console.log(req.body)
    const updatedUser = await User.findOneAndUpdate(
      { userId },
      { $addToSet : {fcmtokens : fcmtoken} },
      { new : true }
    )
    // console.log(updatedUser)
    const updatedQueue = await Queue.findOneAndUpdate({userId} , {fcmtoken} , {new : true});
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
    const { _id } = req.body;
    const data = await Queue.findByIdAndDelete({_id})
    const io = req.app.get("io");
    io.emit('updatedQueue',await Queue.find());
    return res.status(200).json({message : "User removed from Queue."});
  }
  catch(err) {
    console.log("Error in notifying the user - ",err);
  }
}


// module.exports = { joinQueue,saveToken };