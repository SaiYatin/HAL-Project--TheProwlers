import { useState } from "react";
import axios from "axios";
import './CheckCropPrices.css'


const crops = [
  "Bangalore Tomato", "Beans", "Beetroot", "Bitter Gourd", "Bottle Gourd", "Brinjal", "Broad Beans",
  "Cabbage", "Capsicum", "Carrot", "Cauliflower", "Chayote", "Colocasia", "Coriander Leaves",
  "Cucumber", "Drumstick", "Ginger", "Green Chilli", "Green Plantain", "kohlrabi", "Ladies Finger",
  "Mint", "Onion (Big)", "Onion(Small)", "Plantain Flower", "Plantain Stem", "Potato", "Pumpkin",
  "Radish", "Ridge Gourd", "Scarlet Gourd", "Snake Gourd", "Sweet Potato", "Tapioca", "Tomato", "Yam"
];

const cities = [
  "Ahmedabad", "Madurai", "Visakhapatnam", "Lucknow", "Vijayawada", "Kolkata", "Surat", "Patna", "Kochi",
  "Jaipur", "Mysore", "Bangalore", "Vadodara", "Mumbai", "Nashik", "Hyderabad", "Pune", "Nagpur", "Chennai",
  "Coimbatore", "Bhubaneswar", "Trivandrum"
];
const seasons = ["Kharif", "Rabi", "Zaid", "Post-Monsoon"];
const monthsOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const CheckCropPrice = () => {
  const [crop, setCrop] = useState("");
  const [city, setCity] = useState("");
  const [season, setSeason] = useState("");
  const [months, setMonths] = useState(1);
  const [price, setPrice] = useState(null);
  const [predictedPrice, setPredictedPrice] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPrice = async () => {
    if (!crop || !city || !season) return;
    
    setLoading(true);
    setError(null);

    try {
        // First get current price
        const priceResponse = await axios.get(
            `http://localhost:5000/get-price?crop=${crop}&city=${city}`
        );

        const currentPrice = priceResponse.data.price;
        setPrice(currentPrice);

        if (currentPrice && currentPrice !== "Not Available") {
            // Extract numeric value from price string (remove "₹ " and convert to number)
            const numericPrice = parseFloat(currentPrice.replace("₹ ", ""));

            // Get prediction from ML model
            const predictionResponse = await axios.post(
                'http://localhost:5000/predict-price',
                {
                    crop,
                    season,
                    months,
                    currentPrice: numericPrice
                }
            );

            setPredictedPrice(predictionResponse.data.predictedPrice.toFixed(2));
        } else {
            setPrice("Not Available");
            setPredictedPrice("N/A");
        }
    } catch (error) {
        console.error("Error:", error);
        setError("Failed to fetch price data");
        setPrice("Not Available");
        setPredictedPrice("N/A");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="check-crop-price-container">
      <div className="card">
        <h2>Check Crop Price</h2>
        
        <label>Crop: </label>
        <select value={crop} onChange={(e) => setCrop(e.target.value)}>
          <option value="">Select Crop</option>
          {crops.map((c, index) => <option key={index} value={c}>{c}</option>)}
        </select>

        <label>City: </label>
        <select value={city} onChange={(e) => setCity(e.target.value)}>
          <option value="">Select City</option>
          {cities.map((c, index) => <option key={index} value={c}>{c}</option>)}
        </select>

        <label>Season: </label>
        <select value={season} onChange={(e) => setSeason(e.target.value)}>
          <option value="">Select Season</option>
          {seasons.map((s, index) => <option key={index} value={s}>{s}</option>)}
        </select>

        <label>Months Ahead: </label>
        <select value={months} onChange={(e) => setMonths(parseInt(e.target.value))}>
          {monthsOptions.map((m) => <option key={m} value={m}>{m} months</option>)}
        </select>

        <button onClick={fetchPrice} disabled={loading}>
          {loading ? "Loading..." : "Check Price"}
        </button>

        {error && <div className="error-message">{error}</div>}

        {price && (
          <div className="price-info">
            <p>Current Price: <strong>{price}</strong></p>
            <p>Predicted Price (in {months} months): 
              <strong>{predictedPrice !== "N/A" ? `₹ ${predictedPrice}` : predictedPrice}</strong>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckCropPrice;
