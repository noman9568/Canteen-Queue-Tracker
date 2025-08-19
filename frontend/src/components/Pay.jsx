import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getToken } from "firebase/messaging";
import { messaging } from "../firebase/fcm";
const API_URL = import.meta.env.VITE_BACKEND_API_URL;

const Pay = ({cartitems,amount , id}) =>{
  const [token,setToken] = useState('');
  const navigate = useNavigate();
  useEffect(()=>{
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
  },[]);

  const loadRazorpay = () =>{
    const script = document.createElement('script');
    script.src = "https://checkout.razorpay.com/v1/checkout.js",
    script.async = true,
    document.body.appendChild(script);
  };
  useEffect(()=>{
    loadRazorpay();
  },[]);

  const getFCMToken = async () => {
    try {
      const currentToken = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
      });
      return currentToken;
    } catch (error) {
      console.error("Error fetching FCM token:", error);
      return null;
    }
  };


  const payment = async () =>{
    if(!token){
      navigate('/login');
      return;
    }
    try {
      const response = await fetch(`{API_URL}/api/order/placeOrder`,{
        method : "POST",
        headers : {
          "Content-Type" : "application/json"
        },
        body : JSON.stringify({cartitems,token}),
      });
      const orderData = await response.json();
      const options = {
        key: "rzp_test_sTxCPg3g7sdPXL", // Replace with your Razorpay Key ID
        amount: orderData.amount,
        currency: "INR",
        name: "ABES",
        description: "Payment for your order",
        order_id: orderData.id, // Order ID from Razorpay API
        handler: async (response) => {
          alert("Payment Successful!",response);
          console.log(response);
          const res = await fetch(`{API_URL}/api/order/saveOrder`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              token,
              response,
              orderAmount: orderData.amount,
            }),
          });
          const ab = await res.json()
          console.log(ab);

          const fcmtoken = await getFCMToken();
          const userId = id;

          await fetch(`{API_URL}/api/queue/join`,{
            method: "POST",
            headers : {
              "content-type" : "application/json",
            },
            body : JSON.stringify({userId ,fcmtoken})
          })
          // Send payment success details to your backend
        },
        prefill: {
          name: "Testing",
          email: "customer@example.com",
        },
        readonly: {
          contact : true,
        },
        theme: {
          color: "#3399cc",
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    }
    catch(error){
      console.log("Error initiating the payment - ",error);
      alert("Payment initiation failed. Please try again.");
    }
  }



  return (
    <button className="pay-btn" onClick={payment}>Pay {amount}</button>
  )
}

export default Pay;