from app.ml.data_loader import load_sensor_data


data = load_sensor_data(machine_id=1)

print("Total rows:", len(data))

print("\nColumns:")
print(data.columns.tolist())

print("\nFirst 5 readings:")
print(data.head())