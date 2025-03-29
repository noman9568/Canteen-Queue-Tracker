import { useEffect, useState } from "react";
import "../global.css";
import { useNavigate } from "react-router-dom";

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


  const payment = async () =>{
    if(!token){
      navigate('/login');
      return;
    }
    try {
      const response = await fetch("https://canteen-queue-tracker-production.up.railway.app//api/order/placeOrder",{
        method : "POST",
        headers : {
          "content-Type" : "application/json"
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
          alert("Payment Successful!");
          // console.log(response);
          const userId = id;
          const fcmtoken = '3489yrnf3f';

          await fetch("https://canteen-queue-tracker-production.up.railway.app//api/queue/join",{
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
          contact : "",
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