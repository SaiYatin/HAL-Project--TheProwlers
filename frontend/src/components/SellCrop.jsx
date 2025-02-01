import { useState } from "react";
import "./SellCrop.css"; // Import the CSS file for styling

const SellCrop = () => {
    const [cropName, setCropName] = useState("");
    const [quantity, setQuantity] = useState("");
    const [price, setPrice] = useState("");
    const [location, setLocation] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        // Simulate form submission
        setMessage(`Crop "${cropName}" listed successfully!`);
    };

    return (
        <div className="sell-crop-container">
            <h2>Sell Your Crop</h2>
            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label>Crop Name:</label>
                    <input 
                        type="text" 
                        value={cropName} 
                        onChange={(e) => setCropName(e.target.value)} 
                        required 
                    />
                </div>

                <div className="input-group">
                    <label>Quantity (in kg):</label>
                    <input 
                        type="number" 
                        value={quantity} 
                        onChange={(e) => setQuantity(e.target.value)} 
                        required 
                    />
                </div>

                <div className="input-group">
                    <label>Expected Price (per kg):</label>
                    <input 
                        type="number" 
                        value={price} 
                        onChange={(e) => setPrice(e.target.value)} 
                        required 
                    />
                </div>

                <div className="input-group">
                    <label>Location:</label>
                    <input 
                        type="text" 
                        value={location} 
                        onChange={(e) => setLocation(e.target.value)} 
                        required 
                    />
                </div>

                <button type="submit">List Crop for Sale</button>
            </form>

            {message && <p className="success-message">{message}</p>}
        </div>
    );
};

export default SellCrop;
