import React, { useState } from 'react';

const CropPricePredictor = () => {
  const [crop, setCrop] = useState('');
  const [season, setSeason] = useState('Kharif');
  const [presentPrice, setPresentPrice] = useState('');
  const [timeYears, setTimeYears] = useState('');
  const [predictedPrice, setPredictedPrice] = useState(null);
  const [priceChange, setPriceChange] = useState(null);
  const [filteredDataPoints, setFilteredDataPoints] = useState(null);
  const [totalDataPoints, setTotalDataPoints] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear previous results
    setPredictedPrice(null);
    setPriceChange(null);
    setFilteredDataPoints(null);
    setTotalDataPoints(null);
    setError(null);

    // Prepare the request payload
    const data = {
      crop,
      season,
      present_price: parseFloat(presentPrice),
      time_years: parseFloat(timeYears),
    };

    try {
      // Send the request to Flask backend
      const response = await fetch('http://127.0.0.1:5000/predict_price', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();

      if (response.ok) {
        // If successful, update the state with the result
        setPredictedPrice(result.predicted_price);
        setPriceChange(result.price_change_percent);
        setFilteredDataPoints(result.filtered_data_points);
        setTotalDataPoints(result.total_data_points);
      } else {
        // Handle error
        setError(result.error);
      }
    } catch (err) {
      setError('An error occurred while fetching the data.');
    }
  };

  return (
    <div>
      <h1>Crop Price Prediction</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Crop Type:</label>
          <input 
            type="text" 
            value={crop} 
            onChange={(e) => setCrop(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Season:</label>
          <select value={season} onChange={(e) => setSeason(e.target.value)}>
            <option value="Kharif">Kharif</option>
            <option value="Rabi">Rabi</option>
            <option value="Zaid">Zaid</option>
            <option value="Post-Monsoon">Post-Monsoon</option>
          </select>
        </div>
        <div>
          <label>Current Price (₹/ton):</label>
          <input 
            type="number" 
            value={presentPrice} 
            onChange={(e) => setPresentPrice(e.target.value)} 
            required 
          />
        </div>
        <div>
          <label>Time Period (Years):</label>
          <input 
            type="number" 
            value={timeYears} 
            onChange={(e) => setTimeYears(e.target.value)} 
            required 
          />
        </div>
        <button type="submit">Predict Price</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {predictedPrice !== null && (
        <div>
          <h3>Prediction Details</h3>
          <p><strong>Predicted Price: ₹{predictedPrice}</strong></p>
          <p>Price Change: {priceChange}%</p>
          <p>Data points used: {filteredDataPoints} (Filtered from {totalDataPoints} total points)</p>
        </div>
      )}
    </div>
  );
};

export default CropPricePredictor;
