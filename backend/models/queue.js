const mongoose = require('mongoose');

const queueSchema = new mongoose.Schema({
  userId : { type: String  },
  admissionNo : { type: String },
  name : String,
  status : { type : String , enum: ['waiting','notified'] , default : 'waiting'},  //waiting || notified || completed
  fcmtoken: { type: String },  //token for notification
})

module.exports = mongoose.model('Queue',queueSchema)