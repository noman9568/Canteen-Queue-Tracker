import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
const API_URL = import.meta.env.VITE_BACKEND_API_URL;

const Profile = () =>{
  const [data,setData] = useState({});
  const token = localStorage.getItem("token") || [];
  const decoded = jwtDecode(token);
  // console.log(decoded)
  const userId = decoded.userId;
  const userDetails = async (userId) =>{
    try {
      const response = await fetch(`${API_URL}/api/user/userData`,{
        method : "POST",
        headers : {
          "content-Type" : "application/json"
        },
        body : JSON.stringify({userId})
      })
      if(response.ok) {
        const result = await response.json();
        const User = result.user;
        setData({ ...User });
      }
      
    }
    catch(error) {
      console.error("Failed to fetch user details : ",error);
    }
  }
  useEffect(()=>{
    userDetails(userId);
  },[userId]);

  useEffect(()=>{
    // console.log(data);
  },[data])

  return (
    <>
      <div className="profile">
        <div className="name">{data?.name || "Loading..."}</div>
      </div>
    </>
  )
}

export default Profile;