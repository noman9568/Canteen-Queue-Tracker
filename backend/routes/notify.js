const express = require('express');

const router = express.Router();
const admin = require("../config/firebase");

router.post("/",async (req,res)=>{
  const {title , body , token} = req.body;
  const message = {
    notfication : {
      title , 
      body
    },
    token
  };
  try {
    const response = await admin.messaging().sendMulticast(message);
    console.log("Notification sent:", response);
    res.status(200).json({ success: true, response });
  } catch (error) {
    console.error("Error sending notification:", error);
    res.status(500).json({ success: false, error });
  }

})

module.exports = router;

