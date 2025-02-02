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
    const [error, setError] = useState(null);

    const crops = ["Tomato", "Onion", "Wheat", "Rice", "Potato"];

    useEffect(() => {
        if (crop) {
            fetchPrediction();
        }
    }, [crop, months]);

    const fetchPrediction = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:5000/predict-price?crop=${crop}&months=${months}`);
            console.log("API Response:", response.data); // Debugging log

            if (response.data.error) {
                setError(response.data.error);
                setPriceData([]);
                setPredictedPrice(null);
            } else {
                setError(null);
                setPredictedPrice(response.data.predicted_price);
                setPriceData(response.data.trend || []);
            }
        } catch (error) {
            console.error("Error fetching prediction:", error);
            setError("Failed to fetch data. Check your server.");
        }
    };

    const chartData = {
        labels: priceData.length > 0 ? priceData.map(data => data.Date || "Unknown") : [""],
        datasets: [
            {
                label: `${crop} Price Trends`,
                data: priceData.length > 0 ? priceData.map(data => data["Price (₹/kg)"]) : [0],
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
            <input type="number" min="1" max="12" value={months} onChange={(e) => setMonths(Number(e.target.value))} />

            {error && <p className="error">{error}</p>}
            
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
