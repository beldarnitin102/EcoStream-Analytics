from app.ml.data_loader import load_sensor_data
from app.ml.anomaly_detector import AnomalyDetector
from app.ml.health_score import HealthScore


class AnomalyService:

    def analyze_machine(self, machine_id=1):

        # Load historical sensor data
        data = load_sensor_data(machine_id)

        if data.empty:
            return {
                "message": "No sensor data found"
            }

        # Train anomaly detection model
        detector = AnomalyDetector()
        detector.train(data)

        # Predict anomalies
        predictions = detector.predict(data)

        data["prediction"] = predictions

        # Count results
        normal_count = (data["prediction"] == 1).sum()
        anomaly_count = (data["prediction"] == -1).sum()

        # Latest reading
        latest_prediction = int(data.iloc[-1]["prediction"])

        # Calculate health
        health = HealthScore()
        health_result = health.calculate(latest_prediction)

        return {
            "machine_id": machine_id,
            "total_readings": len(data),
            "normal_readings": int(normal_count),
            "anomaly_readings": int(anomaly_count),
            "latest_prediction": latest_prediction,
            "health_score": health_result["health_score"],
            "status": health_result["status"]
        }