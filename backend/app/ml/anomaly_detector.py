from sklearn.ensemble import IsolationForest


class AnomalyDetector:

    def __init__(self):
        self.model = IsolationForest(
            n_estimators=100,
            contamination=0.05,
            random_state=42
        )

    def train(self, data):
        features = data[
            [
                "temperature",
                "vibration",
                "voltage",
                "current",
                "power"
            ]
        ]

        self.model.fit(features)

    def predict(self, data):
        features = data[
            [
                "temperature",
                "vibration",
                "voltage",
                "current",
                "power"
            ]
        ]

        predictions = self.model.predict(features)

        return predictions