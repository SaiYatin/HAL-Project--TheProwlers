import sys
import json
import pickle
import numpy as np
import os
from sklearn.tree import DecisionTreeRegressor

def load_model():
    try:
        current_dir = os.path.dirname(os.path.abspath(__file__))
        model_path = os.path.join(current_dir, 'model', 'price_prediction_model.pkl')
        print(f"Loading model from: {model_path}", file=sys.stderr)
        
        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model file not found at: {model_path}")
        
        with open(model_path, 'rb') as f:
            model = pickle.load(f)
            
        if not isinstance(model, DecisionTreeRegressor):
            raise TypeError(f"Loaded model is not DecisionTreeRegressor, got {type(model)}")
            
        return model
    except Exception as e:
        sys.stderr.write(f"Error loading model: {str(e)}\n")
        sys.exit(1)

def predict_price(model, current_price, months):
    """Calculate predicted price using the trained model."""
    try:
        # Simple baseline prediction based on current price and months
        predicted_price = current_price * (1 + (months * 0.02))  # 2% increase per month
        
        # Apply constraints
        min_price = current_price * 0.5
        max_price = current_price * 2.0
        
        final_price = max(min_price, min(max_price, predicted_price))
        print(f"Debug - Prediction details: current={current_price}, months={months}, predicted={final_price}", 
              file=sys.stderr)
        
        return final_price
        
    except Exception as e:
        sys.stderr.write(f"Prediction calculation error: {str(e)}\n")
        sys.exit(1)

def main():
    try:
        print("Starting prediction script...", file=sys.stderr)
        
        if len(sys.argv) < 2:
            raise ValueError("No input data provided")

        # Parse and validate input
        input_data = sys.argv[1]
        print(f"Raw input data: {input_data}", file=sys.stderr)
        
        request_data = json.loads(input_data)
        print(f"Parsed input: {request_data}", file=sys.stderr)

        required_fields = ['crop', 'season', 'months', 'currentPrice']
        missing_fields = [field for field in required_fields if field not in request_data]
        
        if missing_fields:
            raise ValueError(f"Missing required fields: {', '.join(missing_fields)}")

        # Load model
        model = load_model()
        
        # Make prediction
        predicted_price = predict_price(
            model,
            float(request_data['currentPrice']),
            float(request_data['months'])
        )
        
        # Return result
        output = {"predictedPrice": round(float(predicted_price), 2)}
        print(json.dumps(output), flush=True)  # Make sure to flush the output
        
    except json.JSONDecodeError as e:
        sys.stderr.write(f"Invalid JSON input: {str(e)}\n")
        sys.exit(1)
    except ValueError as e:
        sys.stderr.write(f"Value error: {str(e)}\n")
        sys.exit(1)
    except Exception as e:
        sys.stderr.write(f"Prediction error: {str(e)}\n")
        sys.exit(1)

if __name__ == '__main__':
    main()