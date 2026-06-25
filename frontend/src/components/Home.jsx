import React, { useEffect, useState } from 'react';
import Card from "./Card";

const Home = ({ setCartCount, id }) => {
  const [dData, setdata] = useState([]);
  const [load, setload] = useState(true);
  const [dishQ, setDishQ] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/dishData`);
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
        setDishQ(updatedData.length);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchCartCount = () => {
      const cart = JSON.parse(localStorage.getItem(`cart_${id}`)) || [];
      setCartCount(cart.reduce((acc, item) => acc + item.quantity, 0));
    };
    fetchCartCount();
    const handleStorageChange = () => fetchCartCount();
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [id, setCartCount]);

  return (
    <div className='home-container'>

      {/* ── Hero ── */}
      <div className="top">
        <div className="heading">Your Meal, <span>Without the Wait.</span></div>
        <div className="subH">Fresh flavors, served on time — every time.</div>
      </div>

      {/* ── Live pulse ring ── */}
      <div className="icon-container">
        <div className="circle1"></div>
        <div className="circle2"></div>
        <div className="circle2"></div>
        <div className="circle3"></div>
        <div className="circle4"></div>
        <div className="queue-indicator">
          <span></span> Queue: 3 min
        </div>
        <div className="food-items">
          <div className="food-item">🍜</div>
          <div className="food-item">🥟</div>
          <div className="food-item">☕</div>
          <div className="food-item">🍰</div>
          <div className="food-item">🥗</div>
        </div>
      </div>

      {/* ── Stats bar ── */}
      <section className="stats-bar">
        <div className="stats-grid">
          <div className="stat-item">
            <div className="stat-number">150+</div>
            <div className="stat-label">Happy Customers</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{dishQ}</div>
            <div className="stat-label">Fresh Items Available</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">2.5</div>
            <div className="stat-label">Avg Wait Time (min)</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">95%</div>
            <div className="stat-label">Accuracy Rate</div>
          </div>
        </div>
      </section>

      {/* ── Feature highlights ── */}
      <section className="highlight">
        <div className="h1">
          <div className="h-icon">📱</div>
          <div className="h-p">
            <span>Real-time Updates</span>
            <p>Get live updates on queue length and estimated wait times for all counters.</p>
          </div>
        </div>
        <div className="h2">
          <div className="h-icon">🔔</div>
          <div className="h-p">
            <span>Instant Notifications</span>
            <p>Stay informed with real-time alerts about your order and queue status.</p>
          </div>
        </div>
        <div className="h3">
          <div className="h-icon">💳</div>
          <div className="h-p">
            <span>Secure Payments</span>
            <p>Enjoy fast, reliable, and secure payment options for every order.</p>
          </div>
        </div>
      </section>

      {/* ── Menu ── */}
      <div className='food-container'>
        <p className='chinese'>Chinese</p>
        <div className='cardContainer'>
          <h2 className='load' style={{ display: load ? "block" : "none" }}>Loading...</h2>
          {Array.isArray(dData) && dData.map((element) => {
            if (element.category === "Chinese") {
              return (
                <React.Fragment key={element._id}>
                  <Card
                    id={id}
                    dish={element}
                    dishImage={element.image}
                    setCartCount={setCartCount}
                    dishName={element.name}
                    dishPrice={element.price}
                    dishQuantity={element.quantity}
                  />
                </React.Fragment>
              );
            }
            return null;
          })}
        </div>

        <p className='veg'>Veg Dishes</p>
        <div className='cardContainer'>
          <h2 className='load' style={{ display: load ? "block" : "none" }}>Loading...</h2>
          {Array.isArray(dData) && dData.map((element) => {
            if (element.category === "Veg Dishes") {
              return (
                <React.Fragment key={element._id}>
                  <Card
                    id={id}
                    dish={element}
                    dishImage={element.image}
                    setCartCount={setCartCount}
                    dishName={element.name}
                    dishPrice={element.price}
                    dishQuantity={element.quantity}
                  />
                </React.Fragment>
              );
            }
            return null;
          })}
        </div>
      </div>

      <div className="trademark">
        <p>&copy; 2025 CanteenQ™. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Home;