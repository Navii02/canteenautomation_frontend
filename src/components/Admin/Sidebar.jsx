import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './sidebar.css'

function Sidebar() {
  const navigate=useNavigate()
  const handleLogout=()=>{
    sessionStorage.clear()
    navigate('/')

  }
  return (
    <div className="sidebar">
        <Link to="/admin-dashboard" className="admin-title">
        <h2>Admin Panel</h2>
      </Link>
      
      <nav>
        <Link to="/admin-profit">Analytics</Link>
        <Link to="/admin-orders">Manage Orders</Link>
        <Link to="/admin-user">User Management</Link>
        <Link to="/seating">Seating</Link>
        <Link to="/admin-menu">Menu</Link>
      </nav>

      {/* Logout Button Placed Below Links */}
      <button className="btn btn-danger logout-btn" onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default Sidebar
