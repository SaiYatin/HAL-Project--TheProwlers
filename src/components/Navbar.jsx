import { Link } from "react-router-dom";
import './Navbar.css';

const Navbar = () => {
    return (
        <nav className="navbar">
            <Link to="/check-crop-price">Check Crop Price</Link>
            <span>|</span>
            <Link to="/trends">Trends</Link>
            <span>|</span>
            <Link to="/sell-crop">Sell Your Crop</Link>
            <span>|</span>
            <Link to="/weather-recommendation">Weather-Based Recommendation</Link>
            <span>|</span>
            <Link to="/government-schemes">Government Schemes & Subsidies</Link>
        </nav>
    );
};

export default Navbar;
