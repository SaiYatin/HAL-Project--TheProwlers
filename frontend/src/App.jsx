import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import CheckCropPrice from "./components/CheckCropPrice";
import Trends from "./components/Trends";
import SellCrop from "./components/SellCrop";
import WeatherRecommendation from "./components/WeatherRecommendation";
import GovernmentSchemes from "./components/GovernmentSchemes";

function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/check-crop-price" element={<CheckCropPrice />} />
                <Route path="/trends" element={<Trends />} />
                <Route path="/sell-crop" element={<SellCrop />} />
                <Route path="/weather-recommendation" element={<WeatherRecommendation />} />
                <Route path="/government-schemes" element={<GovernmentSchemes />} />
            </Routes>
        </Router>
    );
}

export default App;

