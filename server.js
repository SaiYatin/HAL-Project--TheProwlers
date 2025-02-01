require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const scrapeCropPrices = require("./scrape");

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/cropDB";

mongoose.connect(MONGO_URI)
.then(() => console.log("✅ MongoDB connected successfully"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// Define Mongoose Schema
const CropPriceSchema = new mongoose.Schema({
    crop: String,
    price: String,
    market: String,
    date: String
});

const CropPrice = mongoose.model("CropPrice", CropPriceSchema);

// Scrape and Store Data in DB
app.get("/scrape", async (req, res) => {
    try {
        const data = await scrapeCropPrices();
        if (data.length > 0) {
            await CropPrice.deleteMany({}); // Clear old data
            await CropPrice.insertMany(data);
            return res.json({ message: "✅ Scraping complete", data });
        }
        res.status(500).json({ message: "❌ No data scraped" });
    } catch (error) {
        console.error("❌ Scraping failed:", error);
        res.status(500).json({ message: "Error during scraping" });
    }
});

// Fetch Crop Prices from MongoDB
app.get("/prices", async (req, res) => {
    try {
        const prices = await CropPrice.find();
        res.json(prices);
    } catch (error) {
        console.error("❌ Failed to fetch prices:", error);
        res.status(500).json({ message: "Error fetching prices" });
    }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
