import pandas as pd
import json
import os

csv_file = "backend/data/processed_crop_data.csv"
json_file = "backend/data/processed_crop_data.json"

if not os.path.exists(csv_file):
    print(f"❌ Error: {csv_file} not found!")
    exit(1)

try:
    # Load CSV
    df = pd.read_csv(csv_file)
    df['crop'] = df['crop'].str.strip().str.lower()  # Normalize crop names
    
    # 🔹 Step 1: Separate Numeric and Non-Numeric Columns
    numeric_cols = df.select_dtypes(include=['number']).columns  # Identify numeric columns
    non_numeric_cols = df.select_dtypes(exclude=['number']).columns  # Identify non-numeric columns

    # 🔹 Step 2: Handle Duplicates (Apply Mean to Numeric Data Only)
    if df.duplicated(subset=['crop']).any():
        print("⚠️ Warning: Duplicate crop names found! Aggregating values...")
        df_numeric = df.groupby('crop')[numeric_cols].mean()  # Average numeric columns
        df_non_numeric = df.groupby('crop')[non_numeric_cols].first()  # Keep first non-numeric value
        df = pd.concat([df_numeric, df_non_numeric], axis=1)  # Merge both

    # 🔹 Step 3: Convert to JSON
    df.to_json(json_file, orient="index", indent=4)

    print(f"✅ Successfully converted {csv_file} to {json_file}")

except Exception as e:
    print(f"❌ Error converting CSV to JSON: {e}")
