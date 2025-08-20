const mongoose = require('mongoose');

const queueSchema = new mongoose.Schema({
  orderNo : { type: Number },
  userId: { type: String, ref: "User" },
  admissionNo : { type: String },
  name : String,
  status : { type : String , enum: ['waiting','notified'] , default : 'waiting'},  //waiting || notified || completed
  fcmtoken: { type: String },  //token for notification
})

queueSchema.virtual('orders', {
  ref: 'Order',               // The model to use (make sure Order model is exported somewhere)
  localField: 'userId',       // Field in Queue
  foreignField: 'userId'      // Field in Order
});

// enable virtuals in JSON
queueSchema.set('toObject', { virtuals: true });
queueSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Queue',queueSchema)