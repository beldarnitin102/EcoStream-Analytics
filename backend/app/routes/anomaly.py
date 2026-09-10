from fastapi import APIRouter

from app.ml.anomaly_service import AnomalyService


router = APIRouter(
    prefix="/anomaly",
    tags=["Anomaly Detection"]
)


@router.get("/{machine_id}")
def analyze_machine(machine_id: int):

    service = AnomalyService()

    result = service.analyze_machine(machine_id)

    return result