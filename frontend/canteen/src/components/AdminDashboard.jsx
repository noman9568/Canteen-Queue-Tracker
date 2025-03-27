import React, { useEffect, useState } from 'react'
import socket from './Socket';
import "../admindashboard.css"
import { data } from 'react-router-dom';

const AdminDashboard = () => {
  const [d,setD] = useState([])
  const [none,setNone] = useState(false);
  const getQueue = async () =>{
    const response = await fetch("http://localhost:5000/api/queue/getQueue");
    const data = await response.json()
    setD(data)
    setNone(data.length>0);
  }
  const notify = async () =>{
    if (d.length === 0){
      return;
    }
    const response = await fetch("http://localhost:5000/api/queue/delete",{
      method : "POST",
      headers :{
        "Content-Type" : "application/json"
      },
      body: JSON.stringify({_id : d[0]._id})
    })
    if(response.ok){
      getQueue();
    }
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
  return (
    <div className='admin'>
      <h1>User Orders</h1>
      <ul>
        {d.map((item, index) => (
          <li key={index}>{item.name} : {item.userId}</li>
        ))}
      </ul>
      <div>
        {/* <button onClick={getQueue}>Hello</button> */}
        <button onClick={notify} disabled={!none}>Notify</button>
      </div>
    </div>
  )
}

export default AdminDashboard
