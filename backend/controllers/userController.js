const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Queue = require('../models/queue');
const Order = require("../models/order");

exports.register = async (req,res) =>{
  try{
    const { name , email , admissionNo , password , fcmtoken } = req.body
    const existingUser = await User.findOne({email});
    if(existingUser){
      return res.status(400).json({message : 'User already exists!'});
    }
    const hashpassword = await bcrypt.hash(password,8);
    const newUser = await User.create({
      name,
      email,
      password: hashpassword,
      userId: admissionNo,
      fcmtokens : fcmtoken ? [fcmtoken] : []
    });
    
    res.status(200).json({success : true , message : 'User registered successfully!', user : newUser,abdc :fcmtoken});
  }
  catch(error){
    res.status(500).json({message : "Error in registering the user!",error : error.message});
  }
};


exports.login = async (req,res) =>{
  try{
    const { userId , password } = req.body;
    const oldUser = await User.findOne({userId});
    if(!oldUser){
      return res.status(400).json({message : "User does not exist!"});
    }
    const passwordCheck = await bcrypt.compare(password,oldUser.password);
    if(!passwordCheck){
      return res.status(401).json({message : 'Invalid credentials!'});
    }
    
    const inQueue = await Queue.findOne({admissionNo : userId});
    const token = await jwt.sign({userId : oldUser._id ,role : oldUser.role, timestamp: Date.now()},process.env.JWT_SECRET,{
      expiresIn : '1.5h',
    });
    res.status(200).json({message : 'User successfully logged in.',name : oldUser.name , role : oldUser.role,token})
  }
  catch(error) {
    res.status(500).json({message : "Error in logging in your account.", error : error.message});
  }
}

exports.orderData = async (req,res) =>{
  try {
    const { id } = req.body;
    const orders = await Order.find({userId : id}).sort({createdAt : -1});
    res.json({message : "OK" , orders});
  }
  catch(error) {
    console.log("Error while fetching the order details.");
  }
}

exports.userData = async (req,res) =>{
  try {
    const {userId} = req.body;
    const user = await User.findOne({_id : userId});
    res.status(200).json({user});
  }
  catch(error) {
    res.status(404).json({error});
  }
}

exports.getToken = async (req,res) =>{
  try {
    const {userId} = req.body;
    // console.log(userId);
    const token = await User.findOne({_id : userId}).select("fcmtokens");
    // console.log(token)
    if(token.fcmtokens.length=== 0) {
      return res.status(404).json({message : "No fcm tokens found."});
    }
    res.status(200).json(token.fcmtokens);
  }
  catch(error) {
    console.error(error);
    res.status(500).json({message : "Error in fetching the tokens."});
  }
}

exports.update = async (req,res) =>{
  try {
    const {name , email , id} = req.body;
    const user = await User.findOneAndUpdate({_id : id},{name , email});
    res.status(200).json({message : "User Data updated successfully."});
  }
  catch (err) {
    res.status(401).json({error : "Error in updating user details.",err});
  }
} 

