import { useState } from "react";

const schemes = [
    { name: "Pradhan Mantri Fasal Bima Yojana", description: "A government-backed crop insurance scheme to protect farmers against losses due to natural calamities." },
    { name: "PM-Kisan Samman Nidhi", description: "Provides direct income support of ₹6,000 per year to farmers." },
    { name: "Soil Health Card Scheme", description: "Helps farmers understand the nutrient status of their soil for better crop planning." },
    { name: "National Agriculture Market (eNAM)", description: "An online trading platform for agricultural commodities to help farmers get better prices." },
];

const GovernmentSchemes = () => {
    const [showMore, setShowMore] = useState(false);

    return (
        <div className="schemes-container">
            <h2 className="page-title">Government Schemes & Subsidies</h2>
            <p className="sub-text">Explore various government initiatives designed to support farmers.</p>

            <div className="schemes-list">
                {schemes.slice(0, showMore ? schemes.length : 2).map((scheme, index) => (
                    <div key={index} className="scheme-card">
                        <h3>{scheme.name}</h3>
                        <p>{scheme.description}</p>
                    </div>
                ))}
            </div>

            <button className="show-more-btn" onClick={() => setShowMore(!showMore)}>
                {showMore ? "Show Less" : "View All Schemes"}
            </button>
        </div>
    );
};

export default GovernmentSchemes;
