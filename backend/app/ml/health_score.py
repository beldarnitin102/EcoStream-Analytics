class HealthScore:

    def calculate(self, prediction):
        if prediction == 1:
            return {
                "health_score": 100,
                "status": "NORMAL"
            }

        return {
            "health_score": 50,
            "status": "ANOMALY"
        }