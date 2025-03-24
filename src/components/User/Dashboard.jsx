import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { BellFill } from "react-bootstrap-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import "animate.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./Dashboard.css";
import { url } from "../../service/serviceurl";
const Dashboard = () => {
  const location = useLocation(); // Get current route
  const [menuOpen, setMenuOpen] = useState(false); // Toggle menu state
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  // API base URL

  const navigate = useNavigate()

  useEffect(() => {
    fetchNotifications();
    // Optional: Fetch every 30 seconds for real-time effect
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = sessionStorage.getItem("token"); // Retrieve token from storage
      const response = await axios.get(`${url}/orders/notifications`, {
        headers: { Authorization: `Bearer ${token}` }, // Send token
      });

      // Count unread notifications
      const unreadCount = response.data.filter((notif) => !notif.read).length;
      setUnreadNotifications(unreadCount);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const handleLogout = () => {
  sessionStorage.clear()
  navigate('/')

  };

  return (
    <div className="dashboard-container">
      {/* Navbar */}
      <nav className="nav-bar">
        <div className="nav-left">
          <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            <i className={`fas ${menuOpen ? "fa-times" : "fa-bars"}`}></i>
          </button>
          <h2 className="brand-title">Dashboard</h2>
        </div>

        {/* Navigation Links (Hidden on Small Screens) */}
        <div className={`nav-links ${menuOpen ? "show" : ""}`}>
          <Link className={`nav-link ${location.pathname === "/dashboard-home" ? "active" : ""}`} to="/dashboard-home">
            <i className="fas fa-home"></i> Home
          </Link>
          <Link className={`nav-link ${location.pathname === "/menu" ? "active" : ""}`} to="/menu">
            <i className="fas fa-utensils"></i> Menu
          </Link>
          <Link className={`nav-link ${location.pathname === "/orders" ? "active" : ""}`} to="/orders">
            <i className="fas fa-receipt"></i> Orders
          </Link>
          <Link className={`nav-link ${location.pathname === "/profile" ? "active" : ""}`} to="/profile">
            <i className="fas fa-user"></i> Profile
          </Link>
          <Link className={`nav-link ${location.pathname === "/cart" ? "active" : ""}`} to="/cart">
            <i className="fas fa-cart-shopping"></i> Cart
          </Link>

          {/* Notifications with Badge */}
          <Link className={`nav-link ${location.pathname === "/notification" ? "active" : ""}`} to="/notification">
            <i className="fas fa-bell"></i> Notifications
            {unreadNotifications > 0 && (
              <span className="notification-badge">{unreadNotifications}</span>
            )}
          </Link>

          {/* Logout Button */}
          <button className="logout-btn" onClick={handleLogout}>
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Dashboard;
