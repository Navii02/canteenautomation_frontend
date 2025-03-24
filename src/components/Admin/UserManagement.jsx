import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom"; // Import useNavigate

import { url } from "../../service/serviceurl";// Adjust this to your API URL

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  // Fetch users from backend
  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${url}/api/users`, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`, // Add token to request header
        },
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      // Redirect to login page if error occurs (e.g., unauthorized access)
      navigate("/login");
    }
  };

  // Check if user is authenticated
  const checkAuthentication = () => {
    const token = sessionStorage.getItem("token"); // Retrieve the token from sessionStorage
    if (!token) {
      navigate("/login"); // Redirect to login if token is missing
    }
  };

  // Toggle user status (Active/Suspended)
  const toggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === "Active" ? "Suspended" : "Active";
      const response = await axios.put(`${url}/api/users/${id}/status`, { status: newStatus }, {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("token")}`, // Add token to request header
        },
      });

      if (response.data.success) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === id ? { ...user, status: newStatus } : user
          )
        );
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  useEffect(() => {
    checkAuthentication(); // Check if user is authenticated
    fetchUsers(); // Fetch users data only if authenticated
  }, []);

  return (
    <>
      <div className="row">
        <div className="col-lg-3">
          <Sidebar />
        </div>
        <div className="col-lg-9 container-fluid mt-4">
          <h2 className="text-center mb-4">User Management</h2>
          <table className="table table-bordered table-hover">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user._id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <button
                      className={`btn btn-sm ${user.status === "Active" ? "btn-success" : "btn-secondary"}`}
                      onClick={() => toggleStatus(user._id, user.status)}
                    >
                      {user.status}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default UserManagement;
