import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./SeatManagement.css";
import Sidebar from "./Sidebar";


const SeatManagement = () => {
  // Sample seat data
  const [seats, setSeats] = useState([
    { id: 1, status: "Available" },
    { id: 2, status: "Booked" },
    { id: 3, status: "Available" },
    { id: 4, status: "Reserved" },
    { id: 5, status: "Booked" },
    { id: 6, status: "Available" },
  ]);

  // Function to release a booked or reserved seat
  const releaseSeat = (id) => {
    setSeats((prevSeats) =>
      prevSeats.map((seat) =>
        seat.id === id ? { ...seat, status: "Available" } : seat
      )
    );
  };

  return (
     <>
     <div className="row">
      <div className="col-lg-3">
        <Sidebar/>
      </div>
      <div className="col-lg-9 container-fluid mt-4">
      <h2 className="text-center mb-4">Seat Management</h2>
      <div className="seat-grid">
        {seats.map((seat) => (
          <div
            key={seat.id}
            className={`seat ${seat.status.toLowerCase()}`}
          >
            <span>Seat {seat.id}</span>
            <span className="status">{seat.status}</span>
            {seat.status !== "Available" && (
              <button
                className="btn btn-warning btn-sm mt-2"
                onClick={() => releaseSeat(seat.id)}
              >
                Release Seat
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
     </div>
     </>
  
  );
};

export default SeatManagement;
