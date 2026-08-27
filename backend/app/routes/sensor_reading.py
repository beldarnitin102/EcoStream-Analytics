from datetime import datetime

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.sensor_reading import SensorReading

router = APIRouter(
    prefix="/sensor-readings",
    tags=["Sensor Readings"]
)


@router.post("/")
def create_sensor_reading(
    machine_id: int,
    temperature: float,
    vibration: float,
    voltage: float,
    current: float,
    power: float,
    db: Session = Depends(get_db)
):
    reading = SensorReading(
        machine_id=machine_id,
        timestamp=datetime.utcnow(),
        temperature=temperature,
        vibration=vibration,
        voltage=voltage,
        current=current,
        power=power
    )

    db.add(reading)
    db.commit()
    db.refresh(reading)

    return reading