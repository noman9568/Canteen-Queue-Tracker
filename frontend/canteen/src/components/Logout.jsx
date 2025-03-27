// import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoLogOutOutline } from "react-icons/io5";
import '../global.css';

const Logout = ({setId , setToken , setRole , setUsername}) => {
  const navigate = useNavigate();

  const handleLogout = () =>{
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setId('');
    setUsername('');
    setToken(null);
    setRole(null);
    
    navigate("/login");
  }

  return ( <IoLogOutOutline onClick={handleLogout} className='logout-icon' style={{height : "" , width : ""}}/> )
}

export default Logout
