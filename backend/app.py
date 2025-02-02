from flask import Flask, request, jsonify

app = Flask(__name__)

# Constants (alpha and gamma are 1, so they are implicit)
INFLATION_RATE = 0.06  # Example: 6% inflation rate

# --- Dummy Database Query Functions ---
def get_current_price(crop, city):
    """
    Simulate a database query to retrieve the current price for a given crop and city.
    Replace with your actual database logic.
    """
    # For example purposes, return a constant value.
    return 100.0

def get_demand_growth(crop, season):
    """
    Simulate a database query to retrieve the average demand volume for the given crop and season.
    Replace with your actual database logic.
    """
    # For example purposes, return a constant value.
    return 120.0

def get_supply_growth(crop, season):
    """
    Simulate a database query to retrieve the average supply volume for the given crop and season.
    Replace with your actual database logic.
    """
    # For example purposes, return a constant value.
    return 110.0

# --- API Endpoint ---
@app.route('/predictprice', methods=['POST'])
def predict_price():
    """
    Endpoint to calculate the predicted future price based on:
      - crop: Crop name (e.g., potato, onion, tomato)
      - city: City (used for fetching current price)
      - season: Season (kharif, rabi, zaid, post-monsoon) used for both demand and supply growth
      - time_years: Time period in years (e.g., 0.5 for 6 months)
    """
    data = request.get_json()
    crop = data.get('crop')
    city = data.get('city')       # For current price lookup
    season = data.get('season')   # For both demand and supply growth
    try:
        time_years = float(data.get('time_years', 0))
    except ValueError:
        return jsonify({'error': 'Invalid time value'}), 400

    # 1. Fetch the current price from the database.
    present_price = get_current_price(crop, city)
    
    # 2. Retrieve growth data (both depend on crop and season).
    demand_growth = get_demand_growth(crop, season)
    supply_growth = get_supply_growth(crop, season)
    
    # Check to avoid division by zero.
    if supply_growth == 0:
        return jsonify({'error': 'Invalid supply growth data (division by zero)'}), 400

    # 3. Compute the predicted future price using the formula:
    # future_price = present_price * ((1 + inflation_rate) ** time_years) * ((demand_growth / supply_growth) ** time_years)
    future_price = present_price * ((1 + INFLATION_RATE) ** time_years) * ((demand_growth / supply_growth) ** time_years)
    
    # 4. Return the results.
    return jsonify({
        'present_price': present_price,
        'predicted_price': round(future_price, 2)
    })

# Run the Flask application
if __name__ == '__main__':
    # Use debug=True only in development; remove for production.
    app.run(debug=True)
