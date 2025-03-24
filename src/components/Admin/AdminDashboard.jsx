import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // For redirecting if unauthorized
import Sidebar from "./Sidebar";
import "./AdminDashboard.css";
import { url } from "../../service/serviceurl";
const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    revenue: 0,
    totalOrders: 0,
    menuCount: 0,
  });

  const navigate = useNavigate(); // For redirecting

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const token = sessionStorage.getItem("token"); // Get the token from localStorage

        if (!token) {
          // If no token, redirect to login
          navigate("/login");
          return;
        }

        const response = await axios.get(`${url}/api/admin/stats`, {
          headers: {
            Authorization: `Bearer ${token}`, // Send the token in the header
          },
        });

        setStats(response.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);

        // If the token is invalid or expired, redirect to login
        if (error.response && error.response.status === 401) {
          localStorage.removeItem("token"); // Remove invalid token
          navigate("/login");
        }
      }
    };

    fetchDashboardStats();
  }, [navigate]);

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="main-content">
        <div className="navbar">Admin Dashboard</div>

        {/* Dashboard Stats */}
        <div className="dashboard-cards">
          <div className="card">
            <i className="fas fa-users card-icon"></i>
            <h3 className="card-title">Total Users</h3>
            <p>{stats.totalUsers}</p>
          </div>

          <div className="card">
            <i className="fas fa-chart-line card-icon"></i>
            <h3 className="card-title">Revenue</h3>
            <p>${stats.revenue}</p>
          </div>

          <div className="card">
            <i className="fas fa-box card-icon"></i>
            <h3 className="card-title">Orders</h3>
            <p>{stats.totalOrders}</p>
          </div>

          <div className="card">
            <i className="fas fa-utensils card-icon"></i>
            <h3 className="card-title">Menu Items</h3>
            <p>{stats.menuCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;