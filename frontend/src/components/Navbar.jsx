import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
    return (
        <nav className="navbar">
            <ul>
                <li><Link to="/check-crop-price">Check Crop Price</Link></li>
                <li><Link to="/trends">Trends</Link></li>
                <li><Link to="/sell-crop">Sell Crop</Link></li>
                <li><Link to="/weather-recommendation">Weather Recommendation</Link></li>
                <li><Link to="/government-schemes">Government Schemes</Link></li>
            </ul>
        </nav>
    );
};

export default Navbar;
