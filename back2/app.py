from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load dataset
df = pd.read_csv("dataset_indian_crop_price.csv")

# Map crop types to predefined seasons
crop_season_map = {
    "Wheat": "Rabi",
    "Rice": "Kharif",
    "Onion": "Kharif",
    "Tomato": "Kharif",
    "Potato": "Kharif"
}

def predict_future_price(crop, months):
    season = crop_season_map.get(crop, "Kharif")  # Default to Kharif if not mapped
    filtered_df = df[(df['Crop Type'] == crop) & (df['Season'] == season)].copy()
    
    if filtered_df.empty:
        return {"error": f"No data available for {crop} in {season} season"}
    
    filtered_df['Volume_Difference'] = filtered_df['Supply Volume (tons)'] - filtered_df['Demand Volume (tons)']
    filtered_df = filtered_df[filtered_df['Volume_Difference'] <= 3500]
    
    if filtered_df.empty:
        return {"error": f"No valid data points after filtering for {crop} in {season}"}
    
    avg_demand = filtered_df['Demand Volume (tons)'].mean()
    avg_supply = filtered_df['Supply Volume (tons)'].mean()
    inflation_rate = 0.065  # 6.5% annual inflation
    
    present_price = filtered_df['Price (₹/kg)'].iloc[-1]
    future_price = present_price * ((1 + inflation_rate) ** (months / 12)) * ((avg_demand / avg_supply) ** (months / 12))
    
    return {
        "predicted_price": round(future_price, 2),
        "trend": filtered_df[['Date', 'Price (₹/kg)']].to_dict(orient='records')
    }

@app.route("/predict-price", methods=["GET"])
def predict_price():
    crop = request.args.get("crop")
    months = int(request.args.get("months", 6))
    
    if not crop:
        return jsonify({"error": "Crop is required"}), 400
    
    result = predict_future_price(crop, months)
    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True)
