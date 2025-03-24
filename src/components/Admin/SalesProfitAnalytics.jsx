import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
  PieChart, Pie, Cell, Legend, ResponsiveContainer, BarChart, Bar
} from "recharts";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "./SalesAnalytics.css";
import { url } from "../../service/serviceurl";
const API_URL = `${url}/api/admin/orders`; // Change this to match your API

const SalesAnalytics = () => {
  const [salesData, setSalesData] = useState([]);
  const [categorySales, setCategorySales] = useState([]);
  const [profit, setProfit] = useState(0);
  const [mostSoldCategory, setMostSoldCategory] = useState("");
  const [topItems, setTopItems] = useState([]);

  const EXPENSE = 10000; // Change as per your expense

  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const token = sessionStorage.getItem("token"); // Get token from sessionStorage

    if (!token) {
      navigate("/login"); // If no token, navigate to login
      return;
    }

    fetchOrders(token); // Pass token to fetchOrders function
  }, [navigate]); // Include navigate in the dependency array

  const fetchOrders = async (token) => {
    try {
      const response = await axios.get(API_URL, {
        headers: {
          Authorization: `Bearer ${token}`, // Pass token in Authorization header
        },
      });

      const orders = Array.isArray(response.data) ? response.data : [];
      let totalSales = 0;
      let categoryCount = {};

      orders.forEach((order) => {
        totalSales += order.totalAmount;

        order.cart.forEach((item) => {
          if (categoryCount[item.category]) {
            categoryCount[item.category] += item.quantity || 1;
          } else {
            categoryCount[item.category] = item.quantity || 1;
          }
        });
      });

      const itemCounts = {};
      response.data.forEach((order) => {
        order.cart.forEach((item) => {
          itemCounts[item.name] = (itemCounts[item.name] || 0) + item.quantity;
        });
      });

      const sortedItems = Object.entries(itemCounts)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value);

      setTopItems(sortedItems.slice(0, 4));

      setSalesData(orders);

      // Convert category sales to chart format
      const categoryData = Object.entries(categoryCount).map(([key, value]) => ({
        category: key,
        sales: value,
      }));

      setCategorySales(categoryData);

      // Find the most sold category
      const sortedCategories = categoryData.sort((a, b) => b.sales - a.sales);
      setMostSoldCategory(sortedCategories.length ? sortedCategories[0].category : "N/A");

      // Calculate profit
      setProfit(totalSales - EXPENSE);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A020F0", "#FF4500"];

  return (
    <>
      <div className="row">
        <div className="col-lg-3">
          <Sidebar />
        </div>
        <div className="col-lg-9 container-fluid mt-4">
          <h2 className="text-center mb-4">Sales & Profit Analytics 📊</h2>

          {/* Summary Cards */}
          <div className="row mb-4">
            {[ 
              { title: "Total Sales", value: `₹ ${salesData.reduce((acc, order) => acc + order.totalAmount, 0)}`, color: "primary" },
              { title: "Expense", value: `₹ ${EXPENSE}`, color: "warning" },
              { title: profit >= 0 ? "Profit" : "Loss", value: `₹ ${Math.abs(profit)}`, color: profit >= 0 ? "success" : "danger" },
              { title: "Most Sold Category", value: mostSoldCategory, color: "info" }
            ].map((item, index) => (
              <div key={index} className="col-md-3">
                <div className={`card text-white bg-${item.color} p-3 shadow`}>
                  <h5>{item.title}</h5>
                  <h3>{item.value}</h3>
                </div>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="row">
            {/* Sales Trend Line Chart */}
            <div className="col-md-6">
              <h5>Daily Sales Trend</h5>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesData.map(order => ({ date: new Date(order.timestamp).toLocaleDateString(), sales: order.totalAmount }))}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="sales" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Category-wise Sales Bar Chart */}
            <div className="col-md-6">
              <h5>Category-wise Sales</h5>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categorySales}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="sales" fill="#00C49F" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart for Top Selling Item */}
          <div className="col-md-4">
            <h5>Top Selling Items</h5>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={topItems}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label
                >
                  {topItems.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
};

export default SalesAnalytics;
