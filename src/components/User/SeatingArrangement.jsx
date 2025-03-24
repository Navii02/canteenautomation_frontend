import React, { useState, useEffect } from "react";
import axios from "axios";
import "./SeatingArrangement.css";
import "bootstrap/dist/css/bootstrap.min.css";
//import Dashboard from "./Dashboard";
import { url } from "../../service/serviceurl";
//const BASE_URL = "http://localhost:5000"; // Update this if your backend URL differs

const AdminSeatingManagement = () => {
  const [seats, setSeats] = useState([]);

  // Fetch seats from the backend
  useEffect(() => {
    fetchSeats();
  }, []);

  const fetchSeats = async () => {
    try {
      const response = await axios.get(`${url}/seats`);
      setSeats(response.data);
    } catch (error) {
      console.error("Error fetching seats:", error);
    }
  };

  // Toggle seat availability
  const toggleSeatStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "available" ? "unavailable" : "available";
    
    try {
      await axios.put(`${url}/seats/${id}`, { status: newStatus });
      setSeats((prevSeats) =>
        prevSeats.map((seat) =>
          seat._id === id ? { ...seat, status: newStatus } : seat
        )
      );
    } catch (error) {
      console.error("Error updating seat status:", error);
    }
  };

  return (
    <div className="container-fluid py-5">
    
      <div className="container mt-4">
        <h2 className="text-center mb-4">Admin Seating Management</h2>
        <div className="d-flex justify-content-center">
          <div className="seat-grid">
            {seats.map((seat) => (
              <div
                key={seat._id}
                className={`seat ${seat.status === "available" ? "available" : "unavailable"}`}
                onClick={() => toggleSeatStatus(seat._id, seat.status)}
              >
                Table {seat.table}, Seat {seat.seat}
              </div>
            ))}
          </div>
        </div>
        <p className="text-center mt-3">Click a seat to toggle its availability.</p>
      </div>
    </div>
  );
};

export default AdminSeatingManagement;
