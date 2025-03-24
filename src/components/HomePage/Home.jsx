import React from "react";
import { useNavigate } from "react-router-dom";
import "./home.css"; // Import Home CSS
import "bootstrap/dist/css/bootstrap.min.css";
import "animate.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container d-flex align-items-center justify-content-center text-center">
      <div className="content">
        <h1 className="display-4 fw-bold text-white animate__animated animate__fadeInDown">
          Welcome to Canteen Automation System
        </h1>
        <p className="lead text-white animate__animated animate__fadeInUp">
          Manage your food orders with ease. Login to continue:
        </p>
        
        {/* Animated Food Icons */}
        <div className="food-animation">
          🍕 🍔 🍟 🍜 🍩
        </div>

        <div className="button-container mt-4">
          <button 
            onClick={() => navigate("/auth")} 
            className="btn btn-primary btn-lg animate__animated animate__bounceIn"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
