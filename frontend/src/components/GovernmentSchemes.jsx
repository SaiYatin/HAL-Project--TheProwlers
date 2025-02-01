import React, { useState } from "react";
import "./GovernmentSchemes.css";

const schemesData = {
  universal: [
    {
      name: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
      details:
        "Crop insurance with up to 95% premium subsidy, covering pre-sowing to post-harvest losses.",
      link: "https://pmfby.gov.in/"
    },
    {
      name: "PM Kisan Samman Nidhi",
      details: "Direct income support of ₹6,000 per year to farmer families.",
      link: "https://pmkisan.gov.in/"
    },
    {
      name: "Kisan Credit Card Scheme",
      details: "Provides farmers with easy credit access and flexible repayment options.",
      link: "https://www.nabard.org/"
    }
  ],
  cereals: [
    {
      name: "National Food Security Mission (Wheat)",
      details: "Input subsidy of ₹5,000 per hectare, seed minikit distribution, and market support.",
      link: "https://nfsm.gov.in/"
    },
    {
      name: "Rice Development Scheme",
      details: "Promotes SRI method, seed replacement subsidy, and irrigation infrastructure.",
      link: "https://agricoop.nic.in/"
    }
  ],
  pulses: [
    {
      name: "National Food Security Mission (Pulses)",
      details: "Input subsidy of ₹3,000 per hectare, quality seed distribution, and market support.",
      link: "https://nfsm.gov.in/"
    }
  ],
  vegetables: [
    {
      name: "Mission for Integrated Development of Horticulture",
      details: "50% greenhouse subsidy, shade net support, and drip irrigation integration.",
      link: "https://midh.gov.in/"
    }
  ],
  fruits: [
    {
      name: "National Horticulture Mission",
      details: "40-50% plantation cost support, irrigation infrastructure, and cold storage subsidy.",
      link: "https://nhb.gov.in/"
    }
  ],
  commercial: [
    {
      name: "Cotton Development Programme",
      details: "Supports high-density planting, IPM implementation, and market linkage.",
      link: "https://cotcorp.org.in/"
    },
    {
      name: "Sustainable Sugarcane Initiative",
      details: "Seed treatment subsidy, drip irrigation support, and mechanization assistance.",
      link: "https://dfpd.gov.in/"
    }
  ]
};

const GovernmentSchemes = () => {
  const [selectedCategory, setSelectedCategory] = useState("universal");

  return (
    <div className="government-schemes-container">
      <h2>Government Schemes & Subsidies</h2>
      <div className="category-buttons">
        {Object.keys(schemesData).map((category) => (
          <button key={category} onClick={() => setSelectedCategory(category)}>
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>
      <div>
        <h3>{selectedCategory.toUpperCase()} Schemes</h3>
        <ul>
          {schemesData[selectedCategory].map((scheme, index) => (
            <li key={index}>
              <strong>{scheme.name}:</strong> {scheme.details} <br />
              <a href={scheme.link} target="_blank" rel="noopener noreferrer">
                More Info
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default GovernmentSchemes;
