import React, { useState, useEffect } from "react";
import axios from "axios";
import { BellFill } from "react-bootstrap-icons";
import "bootstrap/dist/css/bootstrap.min.css";
import "./UserNotificationsAndRecommendations.css";
import Dashboard from "./Dashboard";
import { url } from "../../service/serviceurl";
const UserNotificationsAndRecommendations = () => {
  const [notifications, setNotifications] = useState([]);
  //const BASE_URL = "http://localhost:5000/api"; // API base URL

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = sessionStorage.getItem("token"); // Retrieve token from storage
      const response = await axios.get(`${url}/orders/notifications`, {
        headers: { Authorization: `Bearer ${token}` }, // Send token
      });
      setNotifications(response.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  return (
    <div className="container-fluid py-5">
      <Dashboard />
    <div className="container mt-4">
      {/* Notifications */}
      <div className="card shadow-sm p-3 mb-3 bg-white rounded">
        <div className="card-header d-flex align-items-center">
          <BellFill className="me-2" /> <strong>User Notifications</strong>
        </div>
        <div className="card-body">
          {notifications.length === 0 ? (
            <p className="text-muted">No notifications</p>
          ) : (
            notifications.map((notif) => (
              <div key={notif.id} className="alert alert-info py-2 mb-2">
                {notif.message}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
    </div>
  );
};

export default UserNotificationsAndRecommendations;
