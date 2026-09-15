from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.sensor_reading import SensorReading

router = APIRouter(
    prefix="/live-data",
    tags=["Live Data"]
)


@router.get("/{machine_id}")
def get_live_data(
    machine_id: int,
    db: Session = Depends(get_db)
):
    readings = (
        db.query(SensorReading)
        .filter(SensorReading.machine_id == machine_id)
        .order_by(SensorReading.id.desc())
        .limit(20)
        .all()
    )

    return [
        {
            "timestamp": reading.timestamp,
            "temperature": reading.temperature,
            "vibration": reading.vibration,
            "voltage": reading.voltage,
            "current": reading.current,
            "power": reading.power,
        }
        for reading in readings
    ]