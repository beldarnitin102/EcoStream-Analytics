from app.ml.anomaly_service import AnomalyService


service = AnomalyService()

result = service.analyze_machine(machine_id=1)

print(result)