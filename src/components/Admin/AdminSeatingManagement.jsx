import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./AdminSeatingManagement.module.css"; // Import CSS Module
import Sidebar from "./Sidebar";

import { url } from "../../service/serviceurl"; // Update to your backend URL

const AdminSeatingManagement = () => {
  const [seats, setSeats] = useState([]);

  useEffect(() => {
    fetchSeats();
  }, []);

  // Fetch seating data from the backend
  const fetchSeats = async () => {
    try {
      const token = localStorage.getItem("token"); // Assuming token is stored in localStorage
      const response = await axios.get(`${url}/seats`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include token in Authorization header
        },
      });
      setSeats(response.data);
    } catch (error) {
      console.error("Error fetching seats:", error);
    }
  };

  // Update seat status in the backend
  const updateStatus = async (id, newStatus) => {
    try {
      const token = sessionStorage.getItem("token"); // Assuming token is stored in localStorage
      await axios.put(
        `${url}/seats/${id}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in Authorization header
          },
        }
      );
      setSeats((prevSeats) =>
        prevSeats.map((seat) =>
          seat._id === id ? { ...seat, status: newStatus } : seat
        )
      );
    } catch (error) {
      console.error("Error updating seat status:", error);
    }
  };

  // Handle seat selection
  const toggleSeat = (seat) => {
    let newStatus;
    if (seat.status === "available") newStatus = "occupied";
    else if (seat.status === "selected") newStatus = "available";
    else if (seat.status === "occupied") newStatus = "available"; // Admin can change occupied seats to available

    updateStatus(seat._id, newStatus);
  };

  return (
    <div className={styles.adminSeatingContainer}>
      <div className="row">
        <div className={`col-lg-2 ${styles.sidebarContainer}`}>
          <Sidebar />
        </div>
        <div className={`col-lg-10 container mt-4 ${styles.mainContent}`}>
          <h2 className={styles.adminSeatingTitle}>Canteen Seating</h2>

          {/* Seating Box */}
          <div className={styles.seatingBox}>
            {/* Seating Layout */}
            <div className={styles.seatingLayout}>
              {[...new Set(seats.map((seat) => seat.table))].map((tableId) => (
                <div key={tableId} className={styles.tableBox}>
                  <p>Table {tableId}</p>
                  <div className={styles.seats}>
                    {seats
                      .filter((seat) => seat.table === tableId)
                      .map((seat) => (
                        <div
                          key={seat._id}
                          className={`${styles.seat} ${
                            styles[seat.status]
                          }`} // Apply dynamic class
                          onClick={() => toggleSeat(seat)}
                        >
                          {seat.number}
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className={styles.legend}>
              <div className={styles.legendItem}>
                <div className={`${styles.legendBox} ${styles.legendAvailable}`}></div> Available
              </div>
            
              <div className={styles.legendItem}>
                <div className={`${styles.legendBox} ${styles.legendOccupied}`}></div> Occupied
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSeatingManagement;
