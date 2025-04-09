import { useEffect, useState } from "react";
import { requestForToken, onMessageListener } from "../firebase/fcm";
import { jwtDecode } from "jwt-decode";

const NotificationSetup = ({ children }) => {
  const [isTokenFound, setTokenFound] = useState(false);
  const [fcmtoken,setfcmToken] = useState('');
  const [decoded,setDecoded] = useState(null);
  // console.log(decoded);
  const API_URL = import.meta.env.VITE_BACKEND_API_URL;

  useEffect(()=>{
    const token = localStorage.getItem("token");
    if(token) {
      const decoded = jwtDecode(token);
      setDecoded(decoded);
    }
  },[]);
  useEffect(()=>{

  },[decoded]);

  useEffect(() => {
    requestForToken(setTokenFound , setfcmToken);
    const unsubscribe = onMessageListener()
      .then(payload => {
        // console.log("Foreground notification: ", payload);

        const { title, body } = payload.notification;
        if (Notification.permission === "granted" && isTokenFound) {
          new Notification(title, {body});
        }
        alert(`${title}\n${body}`);
      })
      .catch(err => console.log("Failed: ", err));

      return () => {
        if (typeof unsubscribe === 'function') unsubscribe();
      };
  }, []);

  useEffect(()=>{
    if(fcmtoken && decoded?.userId) {
      sendToken(fcmtoken);
    }
  },[fcmtoken,decoded]);

  const sendToken = async (fcmtoken) =>{
    try {
      const response = await fetch(`${API_URL}/api/queue/saveToken`,{
        method : "POST",
        headers : {
          'content-type' : "application/json"
        },
        body : JSON.stringify({token : fcmtoken, userId : decoded.userId})
      })
      const result = await response.json();
      console.log(result);
    }
    catch(error) {
      console.error("Error in saving the token : ",error);
    }
  }

  return (
    <>
      {children}
    </>
  );
};

export default NotificationSetup;
