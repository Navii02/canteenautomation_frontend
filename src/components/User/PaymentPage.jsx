import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./PaymentPage.css";
import { url } from "../../service/serviceurl";
export default function PaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { token, totalAmount, selectedSeats, takeaway, cart } = location.state || {};

  const [paymentMethod, setPaymentMethod] = useState(null);
  const [timer, setTimer] = useState(120); // 5 minutes timer
  const [paymentDone, setPaymentDone] = useState(false);
  const [redirectedToGPay, setRedirectedToGPay] = useState(false);

  const authToken = sessionStorage.getItem("token"); // Get token from storage
  const user =sessionStorage.getItem("userData")

  
  useEffect(() => {
    if (!authToken) {
      navigate("/login"); // Redirect to login if not authenticated
    }
  }, [authToken, navigate]);

  const merchantUPI = "naveenshaji456@okaxis";
  const gpayLink = `upi://pay?pa=${merchantUPI}&pn=GoGrill&mc=1234&tid=${token}&tr=TXN${token}&tn=FoodOrder&am=${totalAmount}&cu=INR`;

  // Timer for GPay transactions
  useEffect(() => {
    if (redirectedToGPay && timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(countdown);
            navigate("/cart", { state: { timeout: true } }); // Redirect on timeout
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(countdown);
    }
  }, [redirectedToGPay, timer, navigate]);

  const handlePayment = () => {
    if (paymentMethod === "gpay") {
      setRedirectedToGPay(true);
      window.location.href = gpayLink; // Redirect to Google Pay
    } else if (paymentMethod === "cash") {
      confirmOrder("Cash");
    }
  };

  const confirmOrder = async (paymentMode) => {
    try {
      await axios.post(
        `${url}/confirm-order`,
        {
          token,
          totalAmount,
          cart,
          seats: takeaway ? [] : selectedSeats,
          takeaway,
          paymentMode,
          username:user.username
        },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );

      if (!takeaway) {
        await axios.post(
          `${url}/update-seat-status`,
          {
            seatIds: selectedSeats.map((s) => s._id),
            status: "occupied",
          },
          { headers: { Authorization: `Bearer ${authToken}` } }
        );
      }

      navigate("/order-confirmation", { state: { token, totalAmount, takeaway, paymentMode } });
    } catch (error) {
      console.error("Error confirming order:", error);
    }
  };

  return (
    <div className="payment-container">
      <div className="payment-box">
        <h2 className="payment-title">💳 Choose Payment Method</h2>

        <div className="payment-options">
          <button
            className={`payment-btn ${paymentMethod === "gpay" ? "selected" : ""}`}
            onClick={() => setPaymentMethod("gpay")}
          >
            Pay via GPay
          </button>

          <button
            className={`payment-btn ${paymentMethod === "cash" ? "selected" : ""}`}
            onClick={() => setPaymentMethod("cash")}
          >
            Pay by Cash
          </button>
        </div>

        <button className="proceed-btn" onClick={handlePayment} disabled={!paymentMethod}>
          Proceed with {paymentMethod === "gpay" ? "GPay" : "Cash"}
        </button>

        {redirectedToGPay && !paymentDone && (
          <div className="payment-timer">
            <p>⏳ Please complete your payment in {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(1, "0")} min</p>
            <button
              className="payment-done-btn"
              onClick={() => {
                setPaymentDone(true);
                confirmOrder("gpay");
              }}
            >
              Payment Done
            </button>
          </div>
        )}

        <button onClick={() => navigate("/cart")} className="home-btn">
          Back to Home
        </button>
      </div>
    </div>
  );
}
