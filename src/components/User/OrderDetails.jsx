import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import CanteenSeats from "./CanteenSeat";
import axios from "axios";
import styles from "./OrderDetail.module.css"; // Import the CSS module
import { url } from "../../service/serviceurl";
export default function OrderDetail() {
  const location = useLocation();
  const navigate = useNavigate();
  const cart = location.state?.cart || [];

  const [selectedSeats, setSelectedSeats] = useState([]);
  const [allSeatsOccupied, setAllSeatsOccupied] = useState(false);
  const [takeaway, setTakeaway] = useState(false);

  const getServingTime = (category) => {
    const servingTimes = {
      "Fast Food": 10,
      "Dessert": 5,
      "Beverage": 3,
      "Main Course": 15,
    };
    return servingTimes[category] || 10;
  };

  const handleSeatSelect = async (seat) => {
    if (takeaway ||seat.status === "occupied") return;

    let updatedSeats;
    if (selectedSeats.some((s) => s._id === seat._id)) {
      updatedSeats = selectedSeats.filter((s) => s._id !== seat._id);
    } else {
      updatedSeats = [...selectedSeats, seat];
    }

    setSelectedSeats(updatedSeats);

    try {
      await axios.post(`${url}/select-seat`, {
        seatIds: updatedSeats.map((s) => s._id),
      });
    } catch (error) {
      console.error("Error selecting seat:", error);
    }
  };

  const handleTakeaway = () => {
    setTakeaway(true);
    setSelectedSeats([]);
  };

  const handleProceed = async () => {
    try {
      // Fetch the last token number from the backend
      const response = await axios.get(`${url}/orders/last-token`);
      const lastToken = response.data.lastToken || 9;
      
      const tokenNumber = lastToken + 1; // Increment the token number
  
      navigate("/paymentpage", {
        state: {
          selectedSeats,
          token: tokenNumber,
          totalAmount: cart.reduce((acc, item) => acc + item.price, 0),
          takeaway,
          cart,
        },
      });
    } catch (error) {
      console.error("Error fetching last token:", error);
    }
  };
  

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>🍽️ Order Details</h2>

      <div className={styles.orderSummary}>
        <h3>Your Order Summary</h3>
        {cart.length > 0 ? (
          cart.map((item, index) => (
            <div key={index} className={styles.orderItem}>
              <span className={styles.itemName}>{item.name} (₹{item.price})</span>
              <span className={styles.category}>🗂️ {item.category}</span>
              <span className={styles.servingTime}>⏳ {getServingTime(item.category)} min</span>
            </div>
          ))
        ) : (
          <p>Your cart is empty.</p>
        )}
      </div>

      <div className={styles.seatingSection}>
        <CanteenSeats 
          onSeatSelect={handleSeatSelect} 
          selectedSeats={selectedSeats} 
          setAllSeatsOccupied={setAllSeatsOccupied} 
        />
      </div>

      {allSeatsOccupied && !takeaway && (
        <div className={styles.takeawayMessage}>
          <p>⚠️ No seats available. Would you like to take away your order?</p>
          <button className={styles.takeawayBtn} onClick={handleTakeaway}>
            Yes, Takeaway
          </button>
        </div>
      )}

      {!allSeatsOccupied && !takeaway && (
        <button className={styles.takeawayOption} onClick={handleTakeaway}>
          Takeaway Instead
        </button>
      )}

      <button
        className={styles.proceedBtn}
        onClick={handleProceed}
        disabled={!takeaway && selectedSeats.length === 0}
      >
        {takeaway ? "Proceed with Takeaway" : "Proceed with Selected Seats"}
      </button>
    </div>
  );
}
