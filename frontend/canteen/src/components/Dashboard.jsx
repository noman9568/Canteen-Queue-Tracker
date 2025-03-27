import React, { useEffect, useState } from 'react';
import socket from './Socket';
import '../admindashboard.css';

const Dashboard = ({id}) => {
  const [d,setD] = useState([]);
  const [joined,setjoined] = useState(false);

  

  const data = {
    Id: id,
    name:'nothing',
    fcmtoken : '2022'
  }
  const joinQ = async ()=>{
    socket.emit("joinQueue", data);
    setjoined(true)
  }
  const getQueue = async () =>{
    const response = await fetch("http://localhost:5000/api/queue/getQueue");
    const data = await response.json()
    // console.log(data)
    // console.log("current UserId - " , id);
    setD(data);
    setjoined(data.some(item => item.admissionNo === id));
  }

  useEffect(() => {
    getQueue();
  }, [id]);

  useEffect(()=>{
    const handleQueueUpdate = (dataR) => {
      setD(dataR);
      console.log(dataR);
      setjoined(dataR.some(item => item.admissionNo === id));
    };
    socket.on("updatedQueue",handleQueueUpdate)
    return () => {
      socket.off("updatedQueue",handleQueueUpdate);
    };
  },[id])
  return (
    <div className='user'>
      <ul>
        {d.map((item, index) => (
          <li key={index}>{item.name} : {item.userId}</li>
        ))}
      </ul>
      <button onClick={joinQ} disabled={joined}>
        {joined ? "Joined" : "Join"}
      </button>
    </div>
  )
}

export default Dashboard
