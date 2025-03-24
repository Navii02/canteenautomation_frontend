import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import "./OrderManagement.css"; // Import the CSS file
import {  useNavigate } from "react-router-dom"; // For redirecting to login page if unauthenticated

import { url } from "../../service/serviceurl"; // Update if backend URL differs

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const history = useNavigate(); // Using React Router for redirection

  useEffect(() => {
    // Check for token before fetching orders
    const token = sessionStorage.getItem("token");
    if (!token) {
      history("/login"); // Redirect to login if no token is found
    } else {
      fetchOrders(token);
    }
  }, []);

  // Fetch orders from the backend
  const fetchOrders = async (token) => {
    try {
      const response = await axios.get(`${url}/orders`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include token in Authorization header
        },
      });
      const sortedOrders = sortOrders(response.data);
      setOrders(sortedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      if (error.response && error.response.status === 401) {
        // Token expired or invalid, redirect to login page
        history.push("/login");
      }
    }
  };

  const sortOrders = (orders) => {
    return orders.sort((a, b) => (a.status === "Completed" ? 1 : -1));
  };

  // Update order status in the backend
  const updateStatus = async (id, newStatus) => {
    const token = sessionStorage.getItem("token");
    try {
      await axios.put(
        `${url}/orders/${id}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in Authorization header
          },
        }
      );
      setOrders((prevOrders) => {
        const updatedOrders = prevOrders.map((order) =>
          order._id === id ? { ...order, status: newStatus } : order
        );
        return sortOrders(updatedOrders);
      });
    } catch (error) {
      console.error("Error updating order status:", error);
      if (error.response && error.response.status === 401) {
        // Token expired or invalid, redirect to login page
        history.push("/login");
      }
    }
  };

  return (
    <div className="order-management">
      <div className="row">
        <div className="col-lg-2">
          <Sidebar />
        </div>
        <div className="col-lg-10 container mt-4">
          <h2 className="text-center order-heading">Order Management</h2>
          <div className="table-responsive">
            <table className="table custom-table">
              <thead>
                <tr>
                  <th>Token</th>
                  <th>User</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Seats</th>
                  <th>Takeaway</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td className="token-cell">{order.token}</td>
                    <td>{order.username}</td>
                    <td>
                      <ul className="order-list">
                        {order.cart.map((item, index) => (
                          <li key={index}>
                            {item.name} - <strong>₹{item.price}</strong>
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td><strong>₹{order.totalAmount.toFixed(2)}</strong></td>
                    <td className="payment-mode">{order.paymentMode}</td>
                    <td>
                      {order.seats.length > 0 ? (
                        <ul className="order-list">
                          {order.seats.map((seat, index) => (
                            <li key={index}>
                              Table {seat.table}, Seat {seat.seat}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="no-seats">No seats</span>
                      )}
                    </td>
                    <td className="takeaway-status">{order.takeaway ? "Yes" : "No"}</td>
                    <td>
                      <select
                        className={`form-select status-dropdown status-${order.status.toLowerCase()}`}
                        value={order.status}
                        onChange={(e) => updateStatus(order._id, e.target.value)}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Preparing">Preparing</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderManagement;
