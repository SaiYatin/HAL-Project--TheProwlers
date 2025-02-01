import { useState } from "react";
import axios from "axios";
import "./WeatherRecommendation.css";

const WeatherRecommendation = () => {
    const [city, setCity] = useState("");
    const [weather, setWeather] = useState(null);
    const [recommendation, setRecommendation] = useState("");

    const API_KEY = "YOUR_OPENWEATHER_API_KEY"; // Replace with your actual API key

    const fetchWeather = async () => {
        if (!city) return;

        try {
            const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
            );
            setWeather(response.data);
            suggestCrops(response.data.main.temp, response.data.weather[0].main);
        } catch (error) {
            console.error("Error fetching weather:", error);
            setWeather(null);
            setRecommendation("Could not fetch weather data. Try another city.");
        }
    };

    const suggestCrops = (temperature, condition) => {
        let crops = [];

        if (temperature > 30) {
            crops = ["Millets", "Sugarcane", "Rice"];
        } else if (temperature > 20) {
            crops = ["Wheat", "Maize", "Pulses"];
        } else {
            crops = ["Potato", "Carrot", "Barley"];
        }

        if (condition.includes("Rain")) {
            crops.push("Rice", "Jute", "Soybean");
        }

        setRecommendation(`Recommended Crops: ${crops.join(", ")}`);
    };

    return (
        <div className="weather-container">
            <h2>Weather-Based Crop Recommendation</h2>

            <label>Enter City:</label>
            <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter city name"
            />

            <button onClick={fetchWeather}>Get Recommendation</button>

            {weather && (
                <div className="weather-info">
                    <p><strong>Temperature:</strong> {weather.main.temp}°C</p>
                    <p><strong>Condition:</strong> {weather.weather[0].main}</p>
                    <p><strong>{recommendation}</strong></p>
                </div>
            )}
        </div>
    );
};

export default WeatherRecommendation;
