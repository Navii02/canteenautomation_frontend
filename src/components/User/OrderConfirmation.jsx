import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./OrderConfirmation.css"; // Import the CSS file

export default function OrderConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const { token, totalAmount, takeaway, paymentMode } = location.state || {};
  console.log(location.state);
  

  return (
    <div className="confirmation-container">
      <h2 className="confirmation-title">🎉 Order Placed Successfully!</h2>

      <div className="order-details">
        <p><strong>Order ID:</strong> {token}</p>
        <p><strong>Total Amount:</strong> ₹{totalAmount}</p>
        <p><strong>Payment Mode:</strong> {paymentMode === "gpay" ? "Google Pay" : "Cash"}</p>
      </div>

      <div className="confirmation-message">
        {takeaway ? (
          <p className="takeaway-message">🍽️ Please collect your food from the counter.</p>
        ) : (
          <p className="dine-in-message">🪑 Please wait at your seat. Your food will be served soon.</p>
        )}
      </div>

      <button className="home-btn" onClick={() => navigate("/dashboard-home")}>
        Back to Home
      </button>
    </div>
  );
}
