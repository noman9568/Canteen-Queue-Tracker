const Razorpay = require('razorpay');
const Order = require("../models/order");
const jwt = require("jsonwebtoken");
const Queue = require("../models/queue");
const Receipt = require("../models/receipt");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.placeOrder = async (req,res) =>{
  try {
    const { token , cartitems } = req.body;
    const decoded = jwt.decode(token);
    const userId = decoded.userId;
    const totalAmount = cartitems.reduce((acc,item) => acc + item.quantity * item.price,0);
    
    const newOrder = await Order.create({
      userId,
      items : cartitems.map(item => ({
        dishId : item.dishId,
        name : item.name,
        quantity : item.quantity,
        price : item.price
      })),
      totalAmount
    });


    const order = await razorpay.orders.create({
      amount : totalAmount*100,
      currency : "INR",
      receipt : `receipt_${Date.now()}`,
      payment_capture : 1,
    });
    res.json(order);
    
  }
  catch(error) {
    console.log("Error in creating the order - ",error);
    res.status(500).send("Error creating payment.");
  };
};

exports.saveOrder = async (req,res) =>{
  try {
    const { token,response , orderAmount } = req.body;
    const decoded = jwt.decode(token);
    // console.log(decoded);
    const order = await Receipt.create({
      userId : decoded.userId,
      payId: response.razorpay_payment_id,
      orderId : response.razorpay_order_id,
      totalAmount : orderAmount/100
    });
    // console.log("order details - ",order);
    res.status(200).json({message : "Order saved" , order});

  }
  catch(error) {
    console.log("Error in saving the order - " , error);
  }
}


