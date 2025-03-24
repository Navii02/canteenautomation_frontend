import React from "react";
import Dashboard from "./Dashboard";
import "./DashboardHome.css"; // Import CSS for styling
import { motion } from "framer-motion"; // For smooth animations

const DashboardHome = () => {
  return (
    <>
       <div className="dashboard container-fluid py-5">
      <Dashboard /> 
      <div className="dashboard-home-container">
        <motion.div 
          className="dashboard-welcome"
          initial={{ opacity: 0, y: 50 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8 }}
        >
          <h1 className="welcome-title">Welcome to Your Dashboard</h1>
          <p className="welcome-text">
            Manage your orders, explore the menu, and enjoy seamless food ordering.
          </p>
        </motion.div>
      </div>
      </div>
    </>
  );
};

export default DashboardHome;
