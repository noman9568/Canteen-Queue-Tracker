import { useEffect, useState } from "react";
import { requestForToken, onMessageListener } from "../firebase/fcm";

const NotificationSetup = ({ children }) => {
  const [notification, setNotification] = useState(null);
  const [isTokenFound, setTokenFound] = useState(false);

  useEffect(() => {
    requestForToken(setTokenFound);
    onMessageListener()
      .then(payload => {
        console.log("Foreground notification: ", payload);
        setNotification(payload);
      })
      .catch(err => console.log("Failed: ", err));
  }, []);

  return (
    <>
      {children}
      {notification && (
        <div className="notification">
          <p><strong>{notification.notification.title}</strong></p>
          <p>{notification.notification.body}</p>
        </div>
      )}
    </>
  );
};

export default NotificationSetup;
