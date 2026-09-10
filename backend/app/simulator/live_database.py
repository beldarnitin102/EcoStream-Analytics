import time
from datetime import datetime

from app.core.database import SessionLocal
from app.models.sensor_reading import SensorReading
from app.simulator.sensor_generator import SensorGenerator


class LiveDatabaseSimulator:

    def __init__(self, machine_id=1):
        self.machine_id = machine_id
        self.generator = SensorGenerator()

    def run(self):
        while True:

            reading = self.generator.generate_normal_reading(
                season="normal",
                load="NORMAL"
            )

            db = SessionLocal()

            try:
                sensor_reading = SensorReading(
                    machine_id=self.machine_id,
                    timestamp=datetime.utcnow(),
                    temperature=reading["temperature"],
                    vibration=reading["vibration"],
                    voltage=reading["voltage"],
                    current=reading["current"],
                    power=reading["power"]
                )

                db.add(sensor_reading)
                db.commit()

                print("Saved live reading:", reading)

            except Exception as e:
                db.rollback()
                print("Error:", e)

            finally:
                db.close()

            time.sleep(1)


if __name__ == "__main__":
    simulator = LiveDatabaseSimulator(machine_id=1)
    simulator.run()