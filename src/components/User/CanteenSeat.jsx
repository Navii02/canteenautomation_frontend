import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // For redirection
import "./CanteenSeat.css"; // Ensure this CSS file exists
import { url } from "../../service/serviceurl";
export default function CanteenSeats({ onSeatSelect, selectedSeats, setAllSeatsOccupied }) {
  const [seats, setSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token"); // Get token from storage

  useEffect(() => {
    if (!token) {
      navigate("/login"); // Redirect to login if not authenticated
      return;
    }


    const fetchSeats = async () => {
      try {
        const response = await axios.get(`${url}/api/seats`, {
          headers: { Authorization: `Bearer ${token}` }, // Attach token to request
        });
        setSeats(response.data);

        const allOccupied = response.data.every((seat) => seat.status === "occupied");
        setAllSeatsOccupied(allOccupied);
      } catch (error) {
        console.error("Failed to fetch canteen seats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSeats();
  }, [token, navigate, setAllSeatsOccupied]);

  if (loading) {
    return <div className="text-center py-12">Loading canteen seats...</div>;
  }

  // Group seats by table
  const tables = seats.reduce((acc, seat) => {
    if (!acc[seat.table]) {
      acc[seat.table] = [];
    }
    acc[seat.table].push(seat);
    return acc;
  }, {});
  const Navigatetoback=()=>{
    navigate('/menu')
}
  return (
    <div className="canteen-seating-container">
      <h3 className="title">Canteen Seating</h3>

      <div className="seating-layout">
        <div className="entrance-section">
          <h4>Entrance</h4>
          <div className="tables">
            {Object.keys(tables).map((tableNumber) => (
              <div key={tableNumber} className="table">
                <h5>Table {tableNumber}</h5>
                <div className="chairs">
                  {tables[tableNumber].map((seat) => (
                    <button
                      key={seat._id}
                      className={`seat ${
                        seat.status === "occupied"
                          ? "occupied"
                          : selectedSeats.some((s) => s._id === seat._id)
                          ? "selected"
                          : "available"
                      }`}
                      onClick={() => onSeatSelect(seat)}
                      disabled={seat.status === "occupied"}
                    >
                      {seat.seat}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="back-section">
       
          <button className="continue-button" onClick={Navigatetoback}>
          Back
          </button>
        </div>
      </div>
    </div>
  );
}
