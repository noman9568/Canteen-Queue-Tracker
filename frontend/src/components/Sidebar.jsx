import { Link } from 'react-router-dom';
import { FaArrowRight } from "react-icons/fa";
import { GiKnifeFork } from "react-icons/gi";
import { IoHomeOutline } from "react-icons/io5";
import { MdSpaceDashboard } from "react-icons/md";
import { FaRegPenToSquare } from "react-icons/fa6";
import { RiLoginBoxLine } from "react-icons/ri";
import { GrUserAdmin } from "react-icons/gr";
import { IoMdAddCircleOutline } from "react-icons/io";
import { BsCartCheck } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
const Sidebar = ({token , role , setSidebarOpen}) =>{
  const closeSidebar = () =>{
    setSidebarOpen(false);
  }
  return (
    <div className="sidebar">
      <div className='sidebar-header'><span><GiKnifeFork className='logo'/>CanteenQ</span><FaArrowRight onClick={closeSidebar} className='sidebar-logo'/></div>
      {/* <button onClick={closeSidebar} className="close-btn">×</button> */}
      <Link to="/" onClick={closeSidebar}><IoHomeOutline className='sidebar-icons'/>Home</Link>
      {!token && <Link to="/register" onClick={closeSidebar}><FaRegPenToSquare className='sidebar-icons'/>Register</Link>}
      {!token && <Link to="/login" onClick={closeSidebar}><RiLoginBoxLine className='sidebar-icons'/>Login</Link>}
      {token && role == "user" && <Link to="/dashboard" onClick={closeSidebar}><MdSpaceDashboard className='sidebar-icons'/>Dashboard</Link>}
      {token && role == "admin" && <Link to="/admindashboard" onClick={closeSidebar}><GrUserAdmin className='sidebar-icons'/>Admin Dashboard</Link>}
      {token && role == "user" && <Link to="/orders" onClick={closeSidebar}><BsCartCheck className='sidebar-icons'/>Orders</Link>}
      {token && role == "admin" && <Link to="/add" onClick={closeSidebar}><IoMdAddCircleOutline className='sidebar-icons'/>Add</Link>}
      {token && <Link to="/profile"><CgProfile className='sidebar-icons' />Profile</Link>}
    </div>
  )
}
export default Sidebar;