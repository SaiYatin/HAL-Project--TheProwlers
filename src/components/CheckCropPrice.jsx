import { useState, useEffect } from "react";
import axios from "axios";
import './CheckCropPrices.css'

const crops = [
  "Bangalore Tomato", "Beans", "Beetroot", "Bitter Gourd", "Bottle Gourd", "Brinjal", "Broad Beans",
  "Cabbage", "Capsicum", "Carrot", "Cauliflower", "Chayote", "Colocasia", "Coriander Leaves",
  "Cucumber", "Drumstick", "Ginger", "Green Chilli", "Green Plantain", "kohlrabi", "Ladies Finger",
  "Mint", "Onion(Big)", "Onion(Small)", "Plantain Flower", "Plantain Stem", "Potato", "Pumpkin",
  "Radish", "Ridge Gourd", "Scarlet Gourd", "Snake Gourd", "Sweet Potato", "Tapioca", "Tomato", "Yam"
];

const cities = [
  "Ahmedabad", "Madurai", "Visakhapatnam", "Lucknow", "Vijayawada", "Kolkata", "Surat", "Patna", "Kochi",
  "Jaipur", "Mysore", "Bangalore", "Vadodara", "Mumbai", "Nashik", "Hyderabad", "Pune", "Nagpur", "Chennai",
  "Coimbatore", "Bhubaneswar", "Trivandrum"
];

const monthsOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

const CheckCropPrice = () => {
  const [crop, setCrop] = useState("");
  const [city, setCity] = useState("");
  const [months, setMonths] = useState(1);
  const [price, setPrice] = useState(null);
  const [predictedPrice, setPredictedPrice] = useState(null);

  const fetchPrice = async () => {
    if (!crop || !city) return;

    try {
        console.log("Fetching price for:", crop, city);
        const response = await axios.get(`http://localhost:5000/get-price?crop=${crop}&city=${city}`);
        console.log("API Response:", response.data);

        if (response.data.price && response.data.price !== "Not Available") {
            setPrice(response.data.price);
            
            // Predict future price (random increase 10-50%)
            const increaseFactor = 1 + Math.random() * 0.5;
            setPredictedPrice((parseFloat(response.data.price.replace("₹ ", "")) * increaseFactor).toFixed(2));
        } else {
            setPrice("Not Available");
            setPredictedPrice("N/A");
        }
    } catch (error) {
        console.error("Error fetching price:", error);
        setPrice("Not Available");
        setPredictedPrice("N/A");
    }
};

  return (
    <div>
      <h2>Check Crop Price</h2>
      
      <label>Crop: </label>
      <select value={crop} onChange={(e) => setCrop(e.target.value)}>
        <option value="">Select Crop</option>
        {crops.map((c, index) => <option key={index} value={c}>{c}</option>)}
      </select>

      <label> City: </label>
      <select value={city} onChange={(e) => setCity(e.target.value)}>
        <option value="">Select City</option>
        {cities.map((c, index) => <option key={index} value={c}>{c}</option>)}
      </select>

      <label> Months Ahead: </label>
      <select value={months} onChange={(e) => setMonths(parseInt(e.target.value))}>
        {monthsOptions.map((m) => <option key={m} value={m}>{m} months</option>)}
      </select>

      <button onClick={fetchPrice}>Check Price</button>

      {price && (
        <div>
          <p>Current Price: <strong>{price}</strong></p>
          <p>Predicted Price (in {months} months): <strong>₹ {predictedPrice}</strong></p>
        </div>
      )}
    </div>
  );
};

export default CheckCropPrice;
