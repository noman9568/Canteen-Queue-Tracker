import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const API_URL = import.meta.env.VITE_API_URL;
const Order = () =>{
  const [orders,setOrders] = useState([]);
  const [loading,setLoading] = useState(true);
  const orderFetch = async (id) =>{
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/orderData`,{
      method : "POST",
      headers :{
        'content-type' : 'application/json'
      },
      body : JSON.stringify({id})
    });
    const result = await response.json();
    setOrders(result.orders);
    setLoading(false)
  }
  const dateExtract = (dateOrder) =>{
    const dateOnly = new Date(dateOrder);
    return dateOnly.toLocaleDateString();
  } 
  useEffect(()=>{
    const token = localStorage.getItem('token');
    const decoded = jwtDecode(token);
    const id = decoded.userId;
    orderFetch(id);
  },[]);

  useEffect(()=>{
    // console.log( 'Stored data - ',orders);
  },[orders]);

  return (
    <div className="order-container">
      <div className="order">
        <h1>My Orders</h1>
        <span>Track and manage all your food orders</span>
      </div>
      <div className="orders">
        { loading ? <p>Loading...</p> : orders.map((element) => (
          <div key={element._id} className="orderDetail">
            <div className="order-status">
              {element.status === "Completed" ? (
                <span className="delivered">
                  <span className="icon">✓</span>
                  <span className="text">Delivered</span>
                </span>
              ) : (
                <span className="processing">
                  <span className="icon">⏳</span>
                  <span className="text">Processing</span>
                </span>
              )}
              <span className="date">{dateExtract(element.createdAt)}</span>
            </div>
            <div className="order-items">{ element.items.map(item =>(
              <div key={item._id} className="itemDetail"><span className="itemName">{item.name}</span><span className="priceQ">{item.quantity} x {item.price}</span></div>
            )) }</div>
            <div className="total-amount"><span>Total :</span><span>₹ {element.totalAmount}</span></div>
          </div>
        )) }
      </div>
    </div>
  )
}

export default Order;