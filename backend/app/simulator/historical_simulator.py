from datetime import datetime, timedelta

from app.simulator.sensor_generator import SensorGenerator


class HistoricalSimulator:

    def __init__(self):
        self.generator = SensorGenerator()

    def generate_data(
        self,
        days=90,
        readings_per_day=24
    ):
        data = []

        start_time = datetime.utcnow()

        for day in range(1, days + 1):

            # -------------------------
            # Select season
            # -------------------------
            if day <= 30:
                season = "summer"

            elif day <= 60:
                season = "monsoon"

            else:
                season = "winter"

            # -------------------------
            # Calculate degradation
            # -------------------------
            degradation = self.generator.calculate_degradation(
                day,
                days
            )

            # -------------------------
            # Generate readings
            # -------------------------
            for reading_number in range(readings_per_day):

                # Different machine load
                load_cycle = reading_number % 3

                if load_cycle == 0:
                    load = "IDLE"

                elif load_cycle == 1:
                    load = "NORMAL"

                else:
                    load = "HEAVY"

                # Generate normal reading
                reading = self.generator.generate_normal_reading(
                    season=season,
                    load=load
                )

                # Apply machine degradation
                reading = self.generator.apply_machine_degradation(
                    reading,
                    degradation
                )

                # Add simulation information
                timestamp = start_time + timedelta(
                    days=day - 1,
                    hours=reading_number
                )

                reading["timestamp"] = timestamp
                reading["day"] = day
                reading["season"] = season
                reading["load"] = load
                reading["degradation"] = degradation

                data.append(reading)

        return data