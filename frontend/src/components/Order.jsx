import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const API_URL = import.meta.env.VITE_BACKEND_API_URL;
const Order = () =>{
  const [orders,setOrders] = useState([]);
  const [loading,setLoading] = useState(true);
  const orderFetch = async (id) =>{
    const response = await fetch(`${API_URL}/api/user/orderData`,{
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
      <h1 className="order">Orders</h1>
      <div className="orders">
        { loading ? "Loading..." : orders.map((element) => (
          <div key={element._id} className="orderDetail"><div className="order-status" ><span className="status">{element.status==="Completed" ? "✅" : "🔄"}</span><span>{dateExtract(element.createdAt)}</span></div>{ element.items.map(item =>(
            <div key={item._id} className="itemDetail"><span className="itemName">{item.name}</span><span className="priceQ">{item.quantity} x {item.price}</span></div>
          )) }<div className="total-amount"><span>Total :</span><span>₹ {element.totalAmount}</span></div></div>
        )) }
      </div>
    </div>
  )
}

export default Order;