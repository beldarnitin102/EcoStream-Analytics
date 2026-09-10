import time

from app.simulator.sensor_generator import SensorGenerator


class LiveSimulator:

    def __init__(self):
        self.generator = SensorGenerator()

    def generate_reading(self, season="normal", load="NORMAL"):
        return self.generator.generate_normal_reading(
            season=season,
            load=load
        )

    def run(self):
        while True:

            reading = self.generate_reading(
                season="normal",
                load="NORMAL"
            )

            print("Live Reading:", reading)

            time.sleep(1)


if __name__ == "__main__":
    simulator = LiveSimulator()
    simulator.run()