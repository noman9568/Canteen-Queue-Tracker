import React, { useEffect, useState } from 'react'
import socket from './Socket';
import "../admindashboard.css"
import { data } from 'react-router-dom';
const API_URL = import.meta.env.VITE_BACKEND_API_URL;

const AdminDashboard = () => {
  const [d,setD] = useState([])
  const [none,setNone] = useState(false);
  const [loading , setLoading] = useState(false);
  const [tokens,setToken] = useState([]);
  const getQueue = async () =>{
    setLoading(true);
    const response = await fetch(`${API_URL}/api/queue/getQueue`);
    const data = await response.json()
    setD(data)
    setLoading(false);
    setNone(data.length>0);
  }

  useEffect(()=>{
    if(d.length>0){
      getToken();
    }
  },[d])

  const notify = async () =>{
    if (d.length === 0){
      return;
    }
    const updatedQueue = d.map((item,index)=> (
      index===0 ? { ...item , status : "Completed"} : item
    ));
    await sendNotification();
    setD(updatedQueue);

    setTimeout(async ()=>{
      console.log(d[0].userId);
      const response = await fetch(`${API_URL}/api/queue/delete`,{
        method : "POST",
        headers :{
          "Content-Type" : "application/json"
        },
        body: JSON.stringify({_id : d[0]._id , userId : d[0].userId})
      })
      if(response.ok){
        getQueue();
      }
    },1500);
  }
  
  
  useEffect(()=>{
    getQueue();
    socket.on("updatedQueue",(dataR)=>{
      setD(dataR)
      setNone(data.length>0);
    })
    return () => {
      socket.off("updatedQueue");
    };
  },[])
  useEffect(()=>{
    const interval = setInterval(getQueue,5000);
    return () => clearInterval(interval);
  },[]);

  const getToken = async () =>{
    console.log("FCM token request.");
    const res = await fetch(`${API_URL}/api/user/getToken`,{
      method : "POST",
      headers : {
        'content-type' : 'application/json'
      },
      body : JSON.stringify({userId : d[0]._id})
    })
    const result = await res.json();
    console.log(result);
    setToken(result);
  }

  const sendNotification = async () =>{
    const res = await fetch(`${API_URL}/api/queue/notify`,{
      method : "POST",
      headers : {
        'content-type' : 'application/json'
      },
      body : JSON.stringify({
        title : "Order Update",
        body : "Your order is ready!",
        token : tokens
      })
    });
    const result = await res.json();
    console.log(result);
  }

  
  return (
    <div className='admin'>
      <h1>User Orders</h1>
      { loading ? (
      <div className='loading-spinner'>Loading orders...</div>
      ) : (
        d.length === 0 ? (
          <div>No orders in the queue</div>
        ) : (
          d.map((item, index) => (
            <div className='item'>
              <div key={index} className='item-name'>{item.name}<span>ID:{item._id}</span></div>
              <div className="item-status" style={{ color : item.status==='waiting' ? "red" : "green" }}>{item.status}</div>
            </div>
          ))
        )
      )}
      <div className='notify-btn'>
        {/* <button onClick={getQueue}>Hello</button> */}
        <button onClick={notify} disabled={!none}>Notify</button>
      </div>
    </div>
  )
}

export default AdminDashboard
