import React, { useEffect, useState } from 'react'
import socket from './Socket';
import "../admindashboard.css";
const API_URL = import.meta.env.VITE_BACKEND_API_URL;

const AdminDashboard = () => {
  const [d,setD] = useState([]);
  const [none,setNone] = useState(false);
  const [loading , setLoading] = useState(false);
  const [notifying,setNotifiying] = useState(false);
  const getQueue = async () =>{
    setLoading(true);
    const response = await fetch(`${API_URL}/api/queue/getQueue`);
    const data = await response.json();
    setD(data);
    setLoading(false);
    setNone(data.length>0);
  }


  const notify = async () =>{
    if (notifying || d.length === 0){
      return;
    }
    setNotifiying(true);
    const currentUser = d[0];
    const res = await fetch(`${API_URL}/api/user/getToken`,{
      method : "POST",
      headers : {
        'content-type' : 'application/json'
      },
      body : JSON.stringify({userId : currentUser.userId})
    })
    const tokens = await res.json();

    await sendNotification(tokens);
    const updatedQueue = d.map((item,index)=> (
      index===0 ? { ...item , status : "Completed"} : item
    ));
    
    setD(updatedQueue);

    setTimeout(async ()=>{
      // console.log(currentUser.userId);
      const response = await fetch(`${API_URL}/api/queue/delete`,{
        method : "POST",
        headers :{
          "Content-Type" : "application/json"
        },
        body: JSON.stringify({_id : currentUser._id , userId : currentUser.userId})
      })
      if(response.ok){
        getQueue();
      }
      setNotifiying(false);
    },1500);
  }
  
  
  useEffect(()=>{
    getQueue();
    // console.log("Socket connected?", socket.connected);
    socket.on("updatedQueue",(dataR)=>{
      setD(dataR)
      // console.log("Updating the data");
      setNone(dataR.length>0);
    })
    return () => {
      socket.off("updatedQueue");
    };
  },[]);


  const sendNotification = async (token) =>{
    const res = await fetch(`${API_URL}/api/queue/notify`,{
      method : "POST",
      headers : {
        'content-type' : 'application/json'
      },
      body : JSON.stringify({
        title : "Order Update",
        body : "Your order is ready!",
        token : token,
      })
    });
    // console.log("Notfication check - ",res);
    if(res.ok) {
      console.log("Notification sent.");
    }
  }

  
  return (
    <div className='admin'>
      <h1>User Orders</h1>
      { loading ? (
      <div className='loading-spinner'>Loading orders...</div>
      ) : (
        d.length === 0 ? (
          <div className='no-order'>No orders in the queue</div>
        ) : (
          d.map((item, index) => (
            <div className='item' key={item._id}>
              <div key={index} className='item-name'>{item.name}<span>ID:{item._id}</span></div>
              <div className="item-status" style={{ color : item.status==='waiting' ? "red" : "green" }}>{item.status}</div>
            </div>
          ))
        )
      )}
      <div className='notify-btn'>
        <button onClick={notify} disabled={!none || notifying}>
          {notifying ? "Notifying..." : "Notify"}
        </button>
      </div>
    </div>
  )
}

export default AdminDashboard;
