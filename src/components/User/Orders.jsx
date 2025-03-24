import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Orders.css"; // Import styles
import Dashboard from "./Dashboard";
import { url } from "../../service/serviceurl";
const Order = ({ userId }) => {
  const [orders, setOrders] = useState([]);
  const BASE_URL = `${url}/api`; // Base API URL

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = sessionStorage.getItem("token"); // Retrieve token from storage

      const response = await axios.get(`${BASE_URL}/orders`, {
        headers: { Authorization: `Bearer ${token}` }, // Send token
      });

      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  // Function to get status color
  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case "preparing":
        return "status preparing";
      case "completed":
        return "status completed";
      case "cancelled":
        return "status cancelled";
      default:
        return "status";
    }
  };

  return (
    <div className="container-fluid py-5">
      <Dashboard />
      <div className="order-container">
        <h2>My Orders</h2>
        {orders.length === 0 ? (
          <p>No orders yet</p>
        ) : (
          <ul className="order-list">
            {orders.map((order) => (
              <li key={order._id} className="order-item">
                <p><strong>Order ID:</strong> {order.token}</p>
                
                {/* Highlighted Status */}
                <p>
                  <strong>Status:</strong>{" "}
                  <span className={getStatusClass(order.status)}>{order.status}</span>
                </p>

                <p><strong>Total Amount:</strong> ₹{order.totalAmount}</p>
                <p><strong>Takeaway:</strong> {order.takeaway ? "Yes" : "No"}</p>
                
                {order.seats.length > 0 && (
                  <p>
                    <strong>Seats Selected:</strong>{" "}
                    {order.seats.map(seat => (
                      <span key={seat._id}>
                        Table {seat.table}, Seat {seat.seat} <br />
                      </span>
                    ))}
                  </p>
                )}

                <p><strong>Ordered Items:</strong></p>
                <ul>
                  {order.cart.map((item, index) => (
                    <li key={index}>
                      {item.name} - ₹{item.price} x {item.quantity} = ₹{item.price * item.quantity}
                    </li>
                  ))}
                </ul>

                <p><strong>Ordered At:</strong> {new Date(order.timestamp).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Order;
