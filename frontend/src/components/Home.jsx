import React, { useEffect, useState } from 'react';
import Card from "./Card";
const API_URL = import.meta.env.VITE_BACKEND_API_URL;


const Home = ({ setCartCount , id}) => {

  const [dData,setdata] = useState([]);
  const [load,setload] = useState(true);
  useEffect(() =>{
    // console.log(id)
    const fetchData = async ()=>{
      try {
        const response = await fetch(`{API_URL}/api/dishData`);
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
        setload(false);
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
        <div className="heading">Your Meal, Without the Wait.</div>
        <div className="subH">Fresh flavors, served on time—every time.</div>
      </div>

      <div className="icon-container">
        <div className="queue-indicator">
          🕐 Queue: 3 min
        </div>
        <div class="food-items">
          <div class="food-item">🍜</div>
          <div class="food-item">🥟</div>
          <div class="food-item">☕</div>
          <div class="food-item">🍰</div>
          <div class="food-item">🥗</div>
        </div>
      </div>

      <section class="stats-bar">
      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-number">150+</div>
          <div class="stat-label">Happy Customers Today</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">25</div>
          <div class="stat-label">Fresh Items Available</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">2.5</div>
          <div class="stat-label">Avg Wait Time (min)</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">99%</div>
          <div class="stat-label">Accuracy Rate</div>
        </div>
      </div>
    </section>

    <div className='food-container'>
      <p className='chinese'>Chinese</p>
      <div className='cardContainer'>
        <h2 className='load' style={{display : load? "block" : "none"}}>Loading...</h2>
        {Array.isArray(dData) && dData.map((element) => {
          if (element.category==="Chinese") {
            return (
              <React.Fragment key={element._id}>
                {/* <p>Chinese</p> */}
                <Card
                  key={element._id}
                  id={id}
                  dish={element}
                  dishImage={element.image}
                  setCartCount={setCartCount}
                  dishName={element.name}
                  dishPrice={element.price}
                  dishQuantity={element.quantity}
                />
              </React.Fragment>
            )
          }
        }
        )}
      </div>
      <p className='veg'>Veg Dishes</p>
      <div className='cardContainer'>
        <h2 className='load' style={{display : load? "block" : "none"}}>Loading...</h2>
        {Array.isArray(dData) && dData.map((element) => {
          if (element.category==="Veg Dishes") {
            return (
              <React.Fragment key={element._id}>
                <Card
                  key={element._id}
                  id={id}
                  dish={element}
                  dishImage={element.image}
                  setCartCount={setCartCount}
                  dishName={element.name}
                  dishPrice={element.price}
                  dishQuantity={element.quantity}
                />
              </React.Fragment>
            )
          }
        }
        )}
      </div>
    </div>
      
      <div className="trademark">
        <p>&copy; 2025 CanteenQ™. All rights reserved.</p>
      </div>
    </div>
  )
}

export default Home
