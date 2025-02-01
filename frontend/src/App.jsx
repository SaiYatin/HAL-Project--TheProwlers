import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Header from "./components/Header";  // Import Header component
import CheckCropPrice from "./components/CheckCropPrice";
import Trends from "./components/Trends";
import SellCrop from "./components/SellCrop";
import WeatherRecommendation from "./components/WeatherRecommendation";
import GovernmentSchemes from "./components/GovernmentSchemes";
import Footer from "./components/Footer";  // Import Footer component
import './App.css';

function App() {
    return (
        <Router>
            {/* Main container for background and overlay */}
            <div className="main-container">
                <div className="overlay"></div>
                <Header /> {/* Clean Header */}
                <Navbar /> {/* Navbar below Header */}
                <div className="content-container">
                    <Routes>
                        <Route path="/check-crop-price" element={<CheckCropPrice />} />
                        <Route path="/trends" element={<Trends />} />
                        <Route path="/sell-crop" element={<SellCrop />} />
                        <Route path="/weather-recommendation" element={<WeatherRecommendation />} />
                        <Route path="/government-schemes" element={<GovernmentSchemes />} />
                    </Routes>
                </div>
                <Footer /> {/* Footer at the bottom */}
            </div>
        </Router>
    );
}

export default App;
