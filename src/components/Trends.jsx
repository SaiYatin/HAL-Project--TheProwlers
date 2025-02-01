import { useState, useEffect } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import "./Trends.css"; // Import styles

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Trends = () => {
    const [crop, setCrop] = useState("");
    const [priceData, setPriceData] = useState([]);

    const crops = ["Tomato", "Onion", "Wheat", "Rice", "Potato"];

    useEffect(() => {
        if (crop) {
            fetchTrendData();
        }
    }, [crop]);

    const fetchTrendData = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/get-trends?crop=${crop}`);
            setPriceData(response.data.prices);
        } catch (error) {
            console.error("Error fetching trends:", error);
        }
    };

    const chartData = {
        labels: priceData.map(data => data.month),
        datasets: [
            {
                label: `${crop} Price Trends`,
                data: priceData.map(data => data.price),
                borderColor: "#27ae60",
                fill: false,
                tension: 0.2,
            }
        ]
    };

    return (
        <div className="trends-container">
            <h2>Crop Price Trends</h2>
            
            <label>Select Crop:</label>
            <select value={crop} onChange={(e) => setCrop(e.target.value)}>
                <option value="">Select a Crop</option>
                {crops.map((c, index) => <option key={index} value={c}>{c}</option>)}
            </select>

            {priceData.length > 0 ? (
                <div className="chart-container">
                    <Line data={chartData} />
                </div>
            ) : (
                <p>Select a crop to see the trends.</p>
            )}
        </div>
    );
};

export default Trends;
