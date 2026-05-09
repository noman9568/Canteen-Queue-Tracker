import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import "../styles/profile.css";

const Profile = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editBlock,setEditBlock] = useState(false);
  
  const API_URL = import.meta.env.VITE_BACKEND_API_URL;
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        
        if (!token) {
          setError("No authentication token found. Please login again.");
          setLoading(false);
          return;
        }
        
        const decoded = jwtDecode(token);
        const userId = decoded.userId;
        
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/userData`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ userId })
        });
        
        if (!response.ok) {
          throw new Error(`Server responded with status: ${response.status}`);
        }
        
        const result = await response.json();
        setData(result.user);
      } catch (error) {
        console.error("Failed to fetch user details:", error);
        setError("Failed to load user profile. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [API_URL]);
  
  if (loading) {
    return (
      <div className="profile-page">
        <div className="loading-container">
          <div className="loader"></div>
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="profile-page">
        <div className="error-container">
          <div className="error-icon">!</div>
          <h3>Something went wrong</h3>
          <p>{error}</p>
          <button className="retry-button" onClick={() => window.location.reload()}>
            Try Again
          </button>
        </div>
      </div>
    );
  }
  
  // Generate initials for avatar
  const getInitials = () => {
    if (!data.name) return "U";
    return data.name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };
  const toggleEdit = () =>{
    setEditBlock(!editBlock);
  }

  const updateDetails = async () =>{
    await fetch(`${import.meta.env.VITE_API_URL}/api/user/update`,{
      method : "POST",
      headers : {
        "Content-Type" : "application/json"
      },
      body : JSON.stringify({name:data.name , email : data.email , id : data._id})
    });
    // console.log(res);
  }

  
  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <div className="avatar-container">
            <div className="avatar">{getInitials()}</div>
          </div>
          <h1>{data.name || "User"}</h1>
          <span className="role-badge">{data.role}</span>
        </div>
        
        <div className="profile-content">
          <div className="info-card">
            <h2>Personal Information</h2>
            
            <div className="info-row">
              <div className="info-label">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span>Full Name</span>
              </div>
              <div className="info-value">{data.name}</div>
            </div>
            
            <div className="info-row">
              <div className="info-label">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <span>Email</span>
              </div>
              <div className="info-value">{data.email}</div>
            </div>
            
            <div className="info-row">
              <div className="info-label">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18"></path>
                </svg>
                <span>User ID</span>
              </div>
              <div className="info-value user-id">{data.userId}</div>
            </div>
          </div>
          
          {/* {data.fcmtokens && data.fcmtokens.length > 0 && (
            <div className="info-card devices-card">
              <h2>Device Management</h2>
              <div className="devices-container">
                <div className="device-count">
                  <div className="count-circle">{data.fcmtokens.length}</div>
                  <div className="count-label">
                    <span>Connected Devices</span>
                    <small>Manage notification permissions</small>
                  </div>
                </div>
                <button className="devices-button">Manage Devices</button>
              </div>
            </div>
          )} */}
          
          <div className="action-buttons">
            <button  onClick={toggleEdit} className="edit-profile">Edit Profile</button>
            <button className="password-button">Change Password</button>
          </div>
        </div>
      </div>
      { editBlock && ( <div className="edit-profile-block">
        <h2>Edit Profile</h2>
          <div className="info-row">
              <div className="info-label">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <span>Full Name</span>
              </div>
              <input type="text" value={data.name} onChange={(e) => setData({ ...data , name: e.target.value})}/>
              {/* <div className="info-value">{data.name}</div> */}
            </div>
            
            <div className="info-row">
              <div className="info-label">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                  <polyline points="22,6 12,13 2,6"></polyline>
                </svg>
                <span>Email</span>
              </div>
              <input type="text" value={data.email} onChange={(e) => setData({...data , name: e.target.value})} />
              {/* <div className="info-value">{data.email}</div> */}
            </div>
            <div className="buttons">
              <button onClick={toggleEdit}>Cancel</button>
              <button onClick={() => {updateDetails(); toggleEdit()}}>Save</button>
            </div>
          </div> ) }
      <div className={`screen-hover ${editBlock ? "active" : ""}`} onClick={toggleEdit}></div>
    </div>
  );
};

export default Profile;