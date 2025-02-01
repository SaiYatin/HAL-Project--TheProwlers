import { useState, useEffect } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import "./Trends.css";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Trends = () => {
    const [crop, setCrop] = useState("");
    const [months, setMonths] = useState(6);
    const [priceData, setPriceData] = useState([]);
    const [predictedPrice, setPredictedPrice] = useState(null);

    const crops = ["Tomato", "Onion", "Wheat", "Rice", "Potato"];

    useEffect(() => {
        if (crop) {
            fetchPrediction();
        }
    }, [crop, months]);

    const fetchPrediction = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/predict-price?crop=${crop}&months=${months}`);
            setPredictedPrice(response.data.predicted_price);
            setPriceData(response.data.trend);
        } catch (error) {
            console.error("Error fetching prediction:", error);
        }
    };

    const chartData = {
        labels: priceData.map(data => data.Date),
        datasets: [
            {
                label: `${crop} Price Trends`,
                data: priceData.map(data => data["Price (₹/kg)"]),
                borderColor: "#27ae60",
                fill: false,
                tension: 0.2,
            }
        ]
    };

    return (
        <div className="trends-container">
            <h2>Crop Price Prediction</h2>
            
            <label>Select Crop:</label>
            <select value={crop} onChange={(e) => setCrop(e.target.value)}>
                <option value="">Select a Crop</option>
                {crops.map((c, index) => <option key={index} value={c}>{c}</option>)}
            </select>

            <label>Months Ahead:</label>
            <input type="number" min="1" max="12" value={months} onChange={(e) => setMonths(e.target.value)} />

            {predictedPrice !== null && (
                <p>Predicted Price in {months} months: ₹{predictedPrice}/kg</p>
            )}

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
