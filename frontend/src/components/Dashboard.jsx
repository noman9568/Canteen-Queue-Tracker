import React, { useEffect, useState } from 'react';
import socket from './Socket';
import '../admindashboard.css';
import _ from "lodash";
const API_URL = import.meta.env.VITE_BACKEND_API_URL;

const Dashboard = ({id}) => {
  const [d,setD] = useState([]);
  const [loading , setLoading] = useState(false);

  

  // const data = {
  //   Id: id,
  //   name:'nothing',
  //   fcmtoken : '2022'
  // }
  // const joinQ = async ()=>{
  //   socket.emit("joinQueue", data);
  //   setjoined(true)
  // }
  const getQueue = async () =>{
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/queue/getQueue`);
      const data = await response.json()
      const prevId = d.map(item => item._id).sort();
      const newId = data.map(item => item._id).sort();
      
      if(!_.isEqual(prevId,newId)){
        console.log("Updating the data.");
        setD(data);
      }
    }
    catch(error) {
      console.log("Error fetching the queue:",error);
      setLoading(false);
    }
    finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const interval = setInterval(getQueue,5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(()=>{
    const handleQueueUpdate = (dataR) => {
      const prevId = d.map(item => item._id).sort();
      const newId = dataR.map(item => item._id).sort();
      if(!_.isEqual(prevId,newId)){
        setD(dataR);
      }
    };
    socket.on("updatedQueue",handleQueueUpdate)
    return () => {
      socket.off("updatedQueue",handleQueueUpdate);
    };
  },[d])
  return (
    <div className='user'>
      <div className="dashboard-header">Queue Dashboard</div>
      { loading ? (
      <div className='loading-spinner'>Loading orders...</div>
      ) : (
        d.length === 0 ? (
          <div className='noQueue-message'>No orders in the queue</div>
        ) : (
          d.map((item, index) => (
            <div className='item'>
              <div key={index} className='item-name'>{item.name}<span>ID:{item._id}</span></div>
              <div className="item-status" style={{ color : item.status==='waiting' ? "red" : "green" }}>{item.status}</div>
            </div>
          ))
        )
      )}
    </div>

    
  )
}

export default Dashboard
