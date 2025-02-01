import time
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, RandomizedSearchCV
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline

# Start the timer
start_time = time.time()

print("Step 1: Loading dataset...")
# Load dataset
data = pd.read_csv("data_season.csv")
print(f"Step 1 completed. Data loading completed in {time.time() - start_time:.2f} seconds.")

# Display column names and first few rows
print("\nStep 2: Displaying dataset columns and first few rows...")
print("Columns in dataset:", data.columns)
print(data.head())
print("Step 2 completed.")

print("\nStep 3: Preprocessing...")
# Preprocessing
X = data.drop(columns=["price"])  # Use "price" instead of "Price"
y = data["price"]  # Use "price" instead of "Price"

categorical_features = ["Soil type", "Irrigation", "Crops", "Season", "Location"]
numerical_features = ["Year", "Area", "Rainfall", "Temperature", "Humidity", "yeilds"]

numerical_transformer = Pipeline(steps=[
    ("scaler", StandardScaler())
])

categorical_transformer = Pipeline(steps=[
    ("onehot", OneHotEncoder(handle_unknown="ignore"))
])

preprocessor = ColumnTransformer(
    transformers=[
        ("num", numerical_transformer, numerical_features),
        ("cat", categorical_transformer, categorical_features)
    ]
)
print("Step 3 completed.")

print("\nStep 4: Splitting data into training and testing sets...")
split_start = time.time()
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
print(f"Step 4 completed. Data splitting completed in {time.time() - split_start:.2f} seconds.")

print("\nStep 5: Creating the pipeline and model...")
# Define the model
model = RandomForestRegressor(random_state=42)

# Create a pipeline
pipeline = Pipeline(steps=[
    ("preprocessor", preprocessor),
    ("model", model)
])
print("Step 5 completed.")

print("\nStep 6: Performing hyperparameter tuning with RandomizedSearchCV...")
param_distributions = {
    "model__n_estimators": [50, 100, 200],  # Fewer estimators for faster training
    "model__max_depth": [None, 10, 20],
    "model__min_samples_split": [2, 5, 10]
}

random_search_start = time.time()
random_search = RandomizedSearchCV(
    pipeline,
    param_distributions,
    n_iter=10,  # Fewer iterations for quicker tuning
    cv=3,  # Fewer folds for faster tuning
    scoring="neg_mean_absolute_error",
    random_state=42,
    verbose=1,
    n_jobs=-1  # Utilize all available cores for faster training
)
random_search.fit(X_train, y_train)
print(f"Step 6 completed. Randomized search completed in {time.time() - random_search_start:.2f} seconds.")

print("\nStep 7: Evaluating the best model...")
# Best model
best_model = random_search.best_estimator_

evaluation_start = time.time()
y_pred = best_model.predict(X_test)
print("Mean Absolute Error (MAE):", mean_absolute_error(y_test, y_pred))
print("Mean Squared Error (MSE):", mean_squared_error(y_test, y_pred))
print("R-squared (R²):", r2_score(y_test, y_pred))
print(f"Step 7 completed. Model evaluation completed in {time.time() - evaluation_start:.2f} seconds.")

print("\nStep 8: Making predictions for new data...")
# Predict for a specific crop, year, and location
future_data = pd.DataFrame({
    "Year": [2024],
    "Location": ["Mangalore"],
    "Area": [100],
    "Rainfall": [1200],
    "Temperature": [25],
    "Soil type": ["Alluvial"],
    "Irrigation": ["Drip"],
    "yeilds": [5000],
    "Humidity": [70],
    "Crops": ["Coconut"],
    "Season": ["Kharif"]
})

prediction_start = time.time()
predicted_price = best_model.predict(future_data)
print("Predicted Price:", predicted_price[0])
print(f"Step 8 completed. Prediction completed in {time.time() - prediction_start:.2f} seconds.")

# End the timer
end_time = time.time()
print(f"\nTotal execution time: {end_time - start_time:.2f} seconds.")
