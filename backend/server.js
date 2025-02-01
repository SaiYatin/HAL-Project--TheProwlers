require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const scrapeCropPrices = require("./scrape"); // Import scraper
const { spawn } = require('child_process');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/cropDB";

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("✅ MongoDB connected successfully"))
    .catch(err => console.error("❌ MongoDB connection error:", err));

// Define Mongoose Schema
const CropPriceSchema = new mongoose.Schema({
    crop: String,
    city: String,
    price: String,
    quantity: String,
    date: { type: Date, default: Date.now }
});

const PredictionSchema = new mongoose.Schema({
    crop: String,
    season: String,
    months: Number,
    currentPrice: Number,
    predictedPrice: Number,
    date: { type: Date, default: Date.now }
});

const Prediction = mongoose.model("Prediction", PredictionSchema);
const CropPrice = mongoose.model("CropPrice", CropPriceSchema);

// Scrape and Store Data in MongoDB
app.get("/scrape", async (req, res) => {
    console.log("🛠️ Checking the database for the latest entry...");

    try {
        // Get the latest entry from the database
        const latestEntry = await CropPrice.findOne().sort({ date: -1 });

        // Get today's date in local format (without time)
        const today = new Date().toISOString().split("T")[0];

        if (latestEntry) {
            const latestDate = latestEntry.date.toISOString().split("T")[0];

            console.log(`📅 Last stored data date: ${latestDate}`);
            console.log(`🖥️ Local system date: ${today}`);

            // If the database date matches today's date, skip scraping
            if (latestDate === today) {
                console.log("✅ Data is already up-to-date. No need to scrape.");
                return res.json({ message: "✅ Data is already up-to-date", data: await CropPrice.find() });
            }

            console.log("🔄 Data is outdated. Proceeding with scraping...");
        } else {
            console.log("⚠️ No previous data found. Scraping for the first time...");
        }

        // Proceed with scraping since data is outdated or empty
        const data = await scrapeCropPrices();

        if (data.length > 0) {
            await CropPrice.deleteMany({});
            await CropPrice.insertMany(data.map(entry => ({ ...entry, date: new Date() })));

            console.log(`✅ Successfully updated ${data.length} records in MongoDB.`);
            return res.json({ message: "✅ Scraping and upload complete", data });
        }

        console.log("❌ No data scraped.");
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

app.get("/get-price", async (req, res) => {
    const { crop, city } = req.query;
    
    if (!crop || !city) {
        return res.status(400).json({ message: "Crop and city are required." });
    }

    try {
        const priceData = await CropPrice.findOne({ crop, city }).sort({ date: -1 });

        if (!priceData) {
            return res.json({ price: "Not Available" });
        }

        res.json({ price: priceData.price });
    } catch (error) {
        console.error("❌ Error fetching crop price:", error);
        res.status(500).json({ message: "Internal server error." });
    }
});

app.post("/predict-price", async (req, res) => {
    const { crop, season, months, currentPrice } = req.body;

    if (!crop || !season || !months || !currentPrice) {
        return res.status(400).json({ 
            message: "Missing required parameters" 
        });
    }

    try {
        // Convert months to years for the ML model
        const timeYears = months / 12;

        // Spawn Python process
        const pythonProcess = spawn('python', [
            path.join(__dirname, 'predict.py'),
            crop,
            season,
            timeYears.toString(),
            currentPrice.toString()
        ]);

        let predictionResult = '';

        pythonProcess.stdout.on('data', (data) => {
            predictionResult += data.toString();
        });

        pythonProcess.stderr.on('data', (data) => {
            console.error(`Python Error: ${data}`);
        });

        pythonProcess.on('close', async (code) => {
            if (code !== 0) {
                return res.status(500).json({ 
                    message: "Prediction failed" 
                });
            }

            const predictedPrice = parseFloat(predictionResult);

            // Store prediction in database
            const prediction = new Prediction({
                crop,
                season,
                months,
                currentPrice,
                predictedPrice
            });
            await prediction.save();

            res.json({ predictedPrice });
        });
    } catch (error) {
        console.error("Prediction error:", error);
        res.status(500).json({ 
            message: "Error making prediction" 
        });
    }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
