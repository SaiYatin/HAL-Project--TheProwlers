import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <nav style={{ padding: "10px", background: "#ddd" }}>
            <Link to="/check-crop-price">Check Crop Price</Link> | 
            <Link to="/trends">Trends</Link> | 
            <Link to="/sell-crop">Sell Your Crop</Link> | 
            <Link to="/weather-recommendation">Weather-Based Recommendation</Link> | 
            <Link to="/government-schemes">Government Schemes & Subsidies</Link>
        </nav>
    );
};

export default Navbar;
