import pandas as pd

from app.core.database import SessionLocal
from app.models.sensor_reading import SensorReading


def load_sensor_data(machine_id=1):
    db = SessionLocal()

    try:
        readings = (
            db.query(SensorReading)
            .filter(SensorReading.machine_id == machine_id)
            .order_by(SensorReading.timestamp)
            .all()
        )

        data = [
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

        return pd.DataFrame(data)

    finally:
        db.close()