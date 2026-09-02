from app.core.database import SessionLocal
from app.models.sensor_reading import SensorReading
from app.simulator.historical_simulator import HistoricalSimulator


def save_historical_data(machine_id=1):
    simulator = HistoricalSimulator()

    data = simulator.generate_data(
        days=90,
        readings_per_day=24
    )

    db = SessionLocal()

    try:
        for reading in data:

            sensor_reading = SensorReading(
                machine_id=machine_id,
                timestamp=reading["timestamp"],
                temperature=reading["temperature"],
                vibration=reading["vibration"],
                voltage=reading["voltage"],
                current=reading["current"],
                power=reading["power"]
            )

            db.add(sensor_reading)

        db.commit()

        print(f"Saved {len(data)} sensor readings.")

    except Exception as e:
        db.rollback()
        print("Error:", e)

    finally:
        db.close()


if __name__ == "__main__":
    save_historical_data(machine_id=1)