import React, { useEffect, useRef, useState } from 'react';
import socket from './Socket';
import '../admindashboard.css';
import _ from "lodash";
const API_URL = import.meta.env.VITE_BACKEND_API_URL;

// here add {id}
const Dashboard = () => {
  const [d,setD] = useState([]);
  const [loading , setLoading] = useState(false);
  const prevQueueRef = useRef([]);


  const getQueue = async () =>{
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/queue/getQueue`);
      const data = await response.json()
      const prevId = prevQueueRef.current.map(item => item._id).sort();
      const newId = data.map(item => item._id).sort();
      
      if(!_.isEqual(prevId,newId)){
        console.log("Updating the data.");
        setD(data);
        prevQueueRef.current = data;
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
    getQueue();
  }, []);

  useEffect(()=>{
    const handleQueueUpdate = (dataR) => {
      const prevId = prevQueueRef.current.map(item => item._id).sort();
      const newId = dataR.map(item => item._id).sort();
      if(!_.isEqual(prevId,newId)){
        setD(dataR);
        prevQueueRef.current = dataR;
      }
    };
    socket.on("updatedQueue",handleQueueUpdate)
    return () => {
      socket.off("updatedQueue",handleQueueUpdate);
    };
  },[])
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
