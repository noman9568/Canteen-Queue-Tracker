require('dotenv').config()
const express = require('express');
const http = require('http');
const {Server} = require('socket.io');
const cors = require('cors');
const mongoose = require('mongoose');
const PORT = process.env.PORT || 5000;
const queueRoutes = require("./routes/queueRoute");
const userRoutes = require("./routes/userRoutes");
const imageRoutes = require("./routes/imageRoutes");
const orderRoutes = require("./routes/orderRoutes");
const connectDB = require("./config/db");
const admin = require("./config/firebase");
const app = express();
const Queue = require('./models/queue');
const server = http.createServer(app)

const allowedOrigins = [
  "https://canteen-queue-tracker.vercel.app",
  "https://canteen-queue-tracker-production.up.railway.app"
];

app.use((req, res, next) => {
  // Log the user agent to see what's different
  // console.log('User agent:', req.headers['user-agent']);
  next();
});

app.use(cors({
  origin: '*',
  credentials: true,
}));
app.options("*", cors());

const io = new Server(server, {
  cors: {
    origin: "*",
    credentials: true,
  },
});


app.set("io",io);
app.use(express.json());
app.use(express.static('public'));

app.use('/api/queue',queueRoutes);
app.use('/api/user',userRoutes);
app.use('/api',imageRoutes);
app.use('/api/order',orderRoutes);

connectDB();



io.on('connection',(socket)=>{
  console.log("New user connected - ",socket.id);
  socket.on("joinQueue",async (data)=>{
    const newUser = await Queue.create({userId : socket.id , admissionNo : data.Id , name : data.name , fcmtoken : data.fcmtoken});
    // console.log(newUser)
    io.emit('updatedQueue',await Queue.find());
  })
  socket.on("nextturn",async ()=>{
    const nextUser = await Queue.findOne({status : 'waiting'}).sort({_id : 1});

    if(nextUser){
      nextUser.status = 'notified';
      await nextUser.save();

      //send push notification
      if(nextUser.fcmtoken){
        await admin.messaging().send({
          token:nextUser.fcmtoken,
          notification: {
            title : "Canteen Queue Update",
            body : `Hey ${nextUser.name}, it's your turn! 🎉`,
          }
        }).then((response) => console.log("Successfully sent notificaion."))
        .catch(err => console.log('FCM Error :',err) )
      }

      io.emit('updatedQueue',await Queue.find());
    }
  });
  socket.on('message',data=>{
    io.emit('message',data);
  })
  socket.on('disconnect',async()=>{
    await Queue.deleteOne({userId : socket.id});
    io.emit('updatedQueue',await Queue.find());
  })
})



app.post('/saveToken',async (req,res)=>{
  const {userId , fcmtoken} = req.body;
  await Queue.findOneAndUpdate({ userId }, { fcmtoken });
  res.status(200).json({message : 'FCM token saved!'});
})




server.listen(PORT,()=>{
  console.log('Server is running on ',PORT)
});

module.exports = { app,server,io };