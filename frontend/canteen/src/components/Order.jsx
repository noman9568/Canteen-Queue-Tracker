import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { 
  CheckCircle2, 
  Clock, 
  PackageOpen, 
  ShoppingCart, 
  TagIcon 
} from "lucide-react";
import "../global.css";
const Order = () =>{
  const [orders,setOrders] = useState([]);
  const orderFetch = async (id) =>{
    const response = await fetch("http://localhost:5000/api/user/orderData",{
      method : "POST",
      headers :{
        'content-type' : 'application/json'
      },
      body : JSON.stringify({id})
    });
    const result = await response.json();
    // console.log(result.orders)
    
    setOrders(result.orders);
    // console.log(orders);
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
        { orders.map((element) => (
          <div key={element._id} className="orderDetail"><div className="order-status" ><span style={{color : element.status==="Pending" ? "red" : "green"}}><ShoppingCart />{element.status}</span><span>{dateExtract(element.createdAt)}</span></div>{ element.items.map(item =>(
            <div key={item._id} className="itemDetail"><span className="itemName">{item.name}</span><span className="priceQ">{item.quantity} x {item.price}</span></div>
          )) }<div className="total-amount"><span>Total :</span><span>₹ {element.totalAmount}</span></div></div>
        )) }
      </div>
    </div>
  )
}

export default Order;