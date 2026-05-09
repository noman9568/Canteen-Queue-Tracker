import React, { useEffect, useState } from 'react'
import socket from './Socket';
import "../admindashboard.css";
const API_URL = import.meta.env.VITE_BACKEND_API_URL;

const AdminDashboard = () => {
  const [d,setD] = useState([]);
  const [numberOrder, setOrder] = useState(0);
  const [amount, setAmount] = useState(0);
  const [none,setNone] = useState(false);
  const [loading , setLoading] = useState(false);
  const [notifying,setNotifiying] = useState(false);
  const [averageTime, setAverageTime] = useState(0);

  const getQueue = async () =>{
    setLoading(true);
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/queue/getQueue`);
    const data = await response.json();
    setD(data.data);
    setAmount(data.todayAmount);
    setOrder(data.numberOrders);
    // console.log(data);
    setLoading(false);
    setNone(data.data.length>0);
  }


  const notify = async () =>{
    if (notifying || d.length === 0){
      return;
    }
    setNotifiying(true);
    // console.log("clicked");
    const currentUser = d[0];
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/getToken`,{
      method : "POST",
      headers : {
        'content-type' : 'application/json'
      },
      body : JSON.stringify({userId : currentUser.userId})
    })
    const tokens = await res.json();
    

    await sendNotification(tokens[0]);
    const updatedQueue = d.map((item,index)=> (
      index===0 ? { ...item , status : "Completed"} : item
    ));
    
    setD(updatedQueue);

    setTimeout(async ()=>{
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/queue/delete`,{
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
    socket.on("updatedQueue",(dataR)=>{
      setD(dataR)
      setNone(dataR.length>0);
    })
    return () => {
      socket.off("updatedQueue");
    };
  },[]);

  useEffect(() =>{
    socket.on(
      "averageTimeUpdated",
      (data) => {
        setAverageTime(data.averageTime);
      }
    );
    return () => {
    socket.off("averageTimeUpdated");
  };
  }, []);


  const sendNotification = async (token) =>{
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/queue/notify`,{
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
      <div className="section">
        <h1>Admin Dashboard</h1>
        <span>Manage orders and notify customers</span>
      </div>
      <div className="summary">
        <div className="s-item">
          <div className="item-value">{d.length}</div>
          <div className="label">Pending Orders</div>
        </div>
        <div className="s-item">
          <div className="item-value">{numberOrder}</div>
          <div className="label">Completed Today</div>
        </div>
        <div className="s-item">
          <div className="item-value">{averageTime}</div>
          <div className="label">Avg Wait Time (min)</div>
        </div>
        <div className="s-item">
          <div className="item-value">₹ {amount}</div>
          <div className="label">Today's Revenue</div>
        </div>
      </div>

      { loading ? (
      <div className='loading-spinner'>Loading orders...</div>
      ) : (
        d.length === 0 ? (
          <div className='no-order'>No orders in the queue</div>
        ) : (
          d.map((item, index) => (
            <div className='item'>
              <div className="orderNo-id">
                <div className="orderNo"># {item.orderNo}</div>
                <span>ID:{item._id}</span>
              </div>
              <div key={index} className='item-name'>{item.name}</div>
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
