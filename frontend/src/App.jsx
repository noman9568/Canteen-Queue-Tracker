import './App.css'
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import { FaShoppingCart } from 'react-icons/fa';
import { GiHamburgerMenu } from "react-icons/gi";
import Home from './components/Home'
import Register from './components/Register';
import Login from "./components/Login";
import Dashboard from './components/Dashboard';
import AdminDashboard from './components/AdminDashboard';
import Logout from './components/Logout';
import Add from './components/Add';
import Cart from './components/Cart';
import { GiKnifeFork } from "react-icons/gi";
import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import Sidebar from './components/Sidebar';
import Orders from './components/Order';
const API_URL = import.meta.env.VITE_BACKEND_API_URL;

function App() {
  const [id,setId] = useState('');
  const [username,setUsername] = useState('');
  const [token,setToken] = useState(localStorage.getItem("token"));
  const [role,setRole] = useState(localStorage.getItem("role"));
  const [cartcount,setCartCount] = useState(0);
  const [isMobile,setIsMobile] = useState(window.innerWidth <= 768);
  const [sidebarOpen,setSidebarOpen] = useState(false);

  const toggleSidebar = () =>{
    setSidebarOpen(!sidebarOpen);
  }
  // On your frontend
const ismobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
console.log("Is mobile device:", ismobile);
console.log("User agent:", navigator.userAgent);
console.log("API URL used:", API_URL);
  useEffect(()=>{
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize",handleResize);
    return () => window.removeEventListener("resize",handleResize);
  },[]);

  useEffect(()=>{
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartCount(cart.reduce((acc, item) => acc + item.quantity, 0));
  },[]);

  useEffect(()=>{
    if(token){
      try{
        const decoded = jwtDecode(token);
        // console.log('decoded - ',decoded);
        setId(decoded.userId);
        const currentTime = Date.now() /1000;

        if(decoded.exp < currentTime) {
          console.log("Token expired. Logging out...");
          localStorage.removeItem("token");
          localStorage.removeItem("role");
          setToken(null);
          setRole(null);
          setId('');
        }
      }
      catch (error) {
        console.log("Invalid token. Logging out...");
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        setToken(null);
        setRole(null);
        setId('');
      }
    }
  },[token]);

  const ProtectedRoute = ({ children , allowedRoles }) => {
    if(!token || !allowedRoles.includes(role)){
      return <Navigate to="/login" />
    }
    return children;
  };
  return (
    <>
      <Router>
        <nav cartcount={cartcount}>
          <logo><GiKnifeFork className='nav-logo'/>CanteenQ</logo>
            <navbar>
              {!isMobile && (
                <>
                  <Link to="/">Home</Link>
                  {!token && <Link to="/register">Register</Link>}
                  {!token && <Link to="/login">Login</Link>}
                  {token && role==="user" && <Link to="/dashboard">Dashboard</Link>}
                  {token && role==="user" && <Link to="/orders">Orders</Link>}
                  {token && role==="admin" && <Link to="/admindashboard" className='admin-dashboard'>Admin Dashboard</Link> }
                  {token && role==="admin" && <Link to="/add">Add</Link>}
                </>
              )}
              {token && <Logout setId={setId} setToken={setToken} setRole={setRole} setUsername={setUsername} />}
              {<Link to="/cart" className='cart-icon'><FaShoppingCart size={24} />{cartcount >0 && <span className='cart-count'>{cartcount}</span>}</Link>}
              {isMobile && (
                <button onClick={toggleSidebar} className="menu-btn"><GiHamburgerMenu /></button>
              )}
            </navbar>
            <div className={`screen-hover ${sidebarOpen ? "active" : ""}`} onClick={toggleSidebar}></div>
          {sidebarOpen && isMobile && ( <Sidebar token={token} role={role} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} /> )}
        </nav>
        <Routes>
          <Route path="/" element={<Home username={username} id={id} setCartCount={setCartCount}/>} />
          <Route path='/register' element={<Register />} />
          <Route path='/add' element={<Add />} />
          <Route path='/login' element={<Login setId={setId} id={id} setToken={setToken} setUsername={setUsername} setRole={setRole} />} />
          <Route path='/dashboard' element={<ProtectedRoute allowedRoles={['user','admin']}> <Dashboard id={id}/> </ProtectedRoute>} />
          <Route path='/adminDashboard' element={<ProtectedRoute allowedRoles={['admin']}> <AdminDashboard /> </ProtectedRoute> } />
          <Route path='/orders' element={<Orders id={id}/>} />
          <Route path='/cart' element={<Cart setCartCount={setCartCount} id={id}/>} />
        </Routes>
      </Router>
    </>
  )
}

export default App
