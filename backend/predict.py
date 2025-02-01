import sys
import joblib
import pandas as pd

def predict_price(crop, season, time_years, current_price):
    try:
        # Load the model
        model = joblib.load('crop_price_model.joblib')
        
        # Create prediction DataFrame
        pred_df = pd.DataFrame({
            'Crop Type': [crop],
            'Season': [season],
            'Supply Volume (tons)': [1000],  # default value
            'Demand Volume (tons)': [800],   # default value
            'Price (₹/ton)': [0]  # dummy value
        })
        
        # Make prediction
        predicted_price = model.predict_price(
            pred_df, 
            crop, 
            season,
            1000,  # default supply volume
            800    # default demand volume
        )
        
        return float(predicted_price)
        
    except Exception as e:
        print(f"Error in prediction: {str(e)}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) != 5:
        print("Incorrect number of arguments", file=sys.stderr)
        sys.exit(1)
        
    crop = sys.argv[1]
    season = sys.argv[2]
    time_years = float(sys.argv[3])
    current_price = float(sys.argv[4])
    
    result = predict_price(crop, season, time_years, current_price)
    print(result)
    sys.exit(0)