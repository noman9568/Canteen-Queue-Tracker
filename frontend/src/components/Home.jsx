import React, { useEffect, useState } from 'react';
import Card from "./Card";
const API_URL = import.meta.env.VITE_BACKEND_API_URL;

const Home = ({username , setCartCount , id}) => {

  const [dData,setdata] = useState([]);
  useEffect(() =>{
    // console.log(id)
    const fetchData = async ()=>{
      try {
        const response = await fetch(`${API_URL}/api/dishData`);
        const result = await response.json();
        const updatedData = result.data.map((item) => {
          const arrayBufferToBase64 = (buffer) => {
            let binary = '';
            const bytes = new Uint8Array(buffer);
            bytes.forEach((b) => (binary += String.fromCharCode(b)));
            return window.btoa(binary);
          };
          
          const imageBase64 = `data:${item.image.contentType};base64,${arrayBufferToBase64(item.image.data.data)}`;
          
          return { ...item, image: imageBase64 };
        });
        setdata(updatedData);
        // console.log(updatedData)
      }
      catch(error) {
        console.log(error)
      }
    }
    fetchData();
  },[]);
  useEffect(()=>{
    const fetchCartCount = () =>{
      const cart = JSON.parse(localStorage.getItem(`cart_${id}`)) || [];
      setCartCount(cart.reduce((acc, item) => acc + item.quantity, 0));
    };
    fetchCartCount();
    const handleStorageChange = () => fetchCartCount();
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  },[id,setCartCount]);
  
  return (
    <div className='home-container'>
      <div className="top">
        Welcome! {username}.
      </div>
      <div className='cardContainer'>
      {Array.isArray(dData) && dData.map((element) => (
        <Card key={element._id} id={id} dish={element} dishImage={element.image} setCartCount={setCartCount} dishName={element.name} dishPrice={element.price} dishQuantity={element.quantity}/>
      ))}
      </div>
    </div>
  )
}

export default Home
