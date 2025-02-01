import React from "react";
import Navbar from "./Navbar"; // Ensure your Navbar component is properly exported
import "./Header.css";

const Header = () => {
  return (
    <header className="site-header">
      <div className="logo-container">
        {/* Replace 'logo.png' with your actual logo image path */}
        <img src="logo.png" alt="Website Logo" className="site-logo" />
        <h1 className="site-name">My Website</h1>
      </div>
      {/* The Navbar will stick to the bottom of the header */}
      <Navbar />
    </header>
  );
};

export default Header;
