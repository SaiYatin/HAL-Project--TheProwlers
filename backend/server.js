require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const scrapeCropPrices = require("./scrape"); // Import scraper
const path = require("path");
const { PythonShell } = require("python-shell"); 
const fs = require("fs"); // Make sure this is installed // Make sure this is imported

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/cropDB";

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("✅ MongoDB connected successfully"))
    .catch(err => console.error("❌ MongoDB connection error:", err));

// Define Mongoose Schemas
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

// Get Single Crop Price
// Fetch Single Crop Price (GET request instead of POST)
app.get("/get-price", async (req, res) => {
    const { crop, city } = req.query;  // Get parameters from query string
  
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

// Modified predict-price endpoint in server.js
app.post("/predict-price", async (req, res) => {
    console.log("📩 Request Body:", req.body);
    
    const { crop, season, months, currentPrice } = req.body;
    if (!crop || !season || !months || !currentPrice) {
        return res.status(400).json({ 
            message: "Missing required parameters",
            received: { crop, season, months, currentPrice }
        });
    }

    try {
        // Configure Python Shell options with better error handling
        const options = {
            mode: "text",  // Changed from json to text
            pythonOptions: ["-u"],
            scriptPath: path.join(__dirname),
            args: [JSON.stringify({ crop, season, months, currentPrice })]
        };

        // Create a promise wrapper with timeout
        const runPythonScript = () => {
            return new Promise((resolve, reject) => {
                const pythonProcess = new PythonShell("predict.py", options);
                let outputData = "";
                let errorData = "";

                // Collect stdout data
                pythonProcess.on('message', function (message) {
                    outputData += message;
                });

                // Collect stderr data
                pythonProcess.stderr.on('data', function (data) {
                    errorData += data.toString();
                    console.log("Python stderr:", data.toString());
                });

                // Handle completion
                pythonProcess.end(function (err, code, signal) {
                    if (err) {
                        console.error("Python Script Error:", err);
                        console.error("Error Output:", errorData);
                        reject(err);
                    } else {
                        try {
                            const result = JSON.parse(outputData);
                            resolve(result);
                        } catch (parseError) {
                            console.error("Failed to parse Python output:", outputData);
                            reject(parseError);
                        }
                    }
                });

                // Set timeout
                setTimeout(() => {
                    pythonProcess.terminate();
                    reject(new Error("Prediction timeout after 30 seconds"));
                }, 30000);
            });
        };

        const prediction = await runPythonScript();
        console.log("✅ Prediction Result:", prediction);
        
        if (!prediction || !prediction.predictedPrice) {
            throw new Error("Invalid prediction result");
        }

        // Store prediction in database
        const newPrediction = new Prediction({
            crop,
            season,
            months,
            currentPrice,
            predictedPrice: prediction.predictedPrice
        });
        await newPrediction.save();
        
        res.json(prediction);

    } catch (error) {
        console.error("❌ Prediction Error:", error.stack || error);
        res.status(500).json({ 
            message: "Error making prediction", 
            error: error.message,
            details: errorData || "Check server logs for details"
        });
    }
});
// Start Server using PORT from environment variable or default to 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
