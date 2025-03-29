import React, { useEffect, useState } from 'react';
import socket from './Socket';
import '../admindashboard.css';

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
    setLoading(true);
    const response = await fetch("https://canteen-queue-tracker-production.up.railway.app/api/queue/getQueue");
    const data = await response.json()
    setLoading(false);
    setD(data);
  }

  useEffect(() => {
    getQueue();
  }, [id]);

  useEffect(()=>{
    const handleQueueUpdate = (dataR) => {
      setD(dataR);
      console.log(dataR);
    };
    socket.on("updatedQueue",handleQueueUpdate)
    return () => {
      socket.off("updatedQueue",handleQueueUpdate);
    };
  },[id])
  return (
    <div className='user'>
      {/* <button onClick={joinQ} disabled={joined}>
        {joined ? "Joined" : "Join"}
      </button> */}
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
    </div>

    
  )
}

export default Dashboard
