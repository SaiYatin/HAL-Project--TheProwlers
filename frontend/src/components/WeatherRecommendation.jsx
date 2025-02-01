import React, { useState } from "react";
import './WeatherRecommendation.css'; // Import the CSS file

const weatherBasedCrops = {
  hot: ["Cotton", "Peanuts", "Sunflower", "Hemp", "Sorghum", "Millet", "Tobacco"],
  moderate: ["Wheat (Spring)", "Corn/Maize", "Barley", "Rice", "Soybeans", "Kidney Beans", "Pinto Beans", "Navy Beans"],
  cold: ["Wheat (Winter)", "Oats", "Rye", "Apples", "Cherries", "Lentils", "Chickpeas", "Field Peas", "Garlic", "Carrots", "Potatoes"],
  rainy: ["Rice", "Sugarcane", "Tea", "Banana", "Jute", "Pigeon Peas", "Mung Beans", "Black Beans"],
  vegetables: ["Tomatoes", "Lettuce", "Onions", "Cabbage", "Cauliflower", "Broccoli", "Bell Peppers", "Eggplant", "Cucumbers", "Spinach", "Peas", "Radishes"],
  fruits: ["Oranges", "Strawberries", "Grapes", "Blueberries", "Raspberries", "Peaches", "Plums", "Pears"],
  commercial: ["Coffee", "Flax", "Canola"]
};

const WeatherRecommendation = () => {
  const [weather, setWeather] = useState("hot");

  return (
    <div className="weather-recommendation-container">
      <h2>Weather-Based Crop Recommendation</h2>
      <p>Select the current weather condition to get suitable crop recommendations:</p>
      <div>
        {Object.keys(weatherBasedCrops).map((condition) => (
          <button key={condition} onClick={() => setWeather(condition)}>
            {condition.charAt(0).toUpperCase() + condition.slice(1)}
          </button>
        ))}
      </div>
      <div>
        <h3>Recommended Crops for {weather.charAt(0).toUpperCase() + weather.slice(1)} Weather</h3>
        <ul>
          {weatherBasedCrops[weather].map((crop, index) => (
            <li key={index}>{crop}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default WeatherRecommendation;
