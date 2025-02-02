import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  useEffect(() => {
    if (!window.googleTranslateElementInit) {
      window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement(
          { pageLanguage: "en" },
          "google_translate_element"
        );
      };

      const addScript = document.createElement("script");
      addScript.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      addScript.async = true;
      document.body.appendChild(addScript);
    }
  }, []);

  return (
    <nav className="navbar">
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/check-crop-price">Check Crop Price</Link></li>
        <li><Link to="/trends">Trends</Link></li>
        <li><Link to="/sell-crop">Sell Crop</Link></li>
        <li><Link to="/weather-recommendation">Weather Recommendation</Link></li>
        <li><Link to="/government-schemes">Government Schemes</Link></li>
      </ul>

      {/* Google Translate Dropdown */}
      <div id="google_translate_element" className="translate-btn"></div>
    </nav>
  );
};

export default Navbar;
