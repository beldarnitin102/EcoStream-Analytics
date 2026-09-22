from datetime import datetime, timedelta, timezone

from app.simulator.sensor_generator import SensorGenerator


class HistoricalSimulator:

    VALID_SEASONS = {
        "normal",
        "summer",
        "monsoon",
        "winter",
        "auto",
    }

    VALID_LOADS = {
        "IDLE",
        "NORMAL",
        "HEAVY",
        "AUTO",
    }

    def __init__(self):
        self.generator = SensorGenerator()

    def generate_data(
        self,
        days=90,
        readings_per_day=24,
        season="auto",
        load="AUTO",
        degradation_enabled=True,
    ):
        if days < 1 or days > 90:
            raise ValueError("days must be between 1 and 90")

        if readings_per_day < 1:
            raise ValueError("readings_per_day must be at least 1")

        if season.lower() not in self.VALID_SEASONS:
            raise ValueError(
                "season must be one of: normal, summer, monsoon, winter, auto"
            )

        load = load.upper()

        if load not in self.VALID_LOADS:
            raise ValueError(
                "load must be one of: IDLE, NORMAL, HEAVY, AUTO"
            )

        season = season.lower()

        data = []

        # Generate historical data going backwards from the present,
        # so the simulated readings do not appear in the future.
        now_utc = datetime.now(timezone.utc).replace(tzinfo=None)

        start_time = now_utc - timedelta(days=days)

        for day in range(1, days + 1):

            # -------------------------
            # Select season
            # -------------------------
            if season == "auto":
                if day <= 30:
                    current_season = "summer"
                elif day <= 60:
                    current_season = "monsoon"
                else:
                    current_season = "winter"
            else:
                current_season = season

            # -------------------------
            # Calculate degradation
            # -------------------------
            if degradation_enabled:
                degradation = self.generator.calculate_degradation(
                    day,
                    days
                )
            else:
                degradation = 0.0

            # -------------------------
            # Generate readings
            # -------------------------
            for reading_number in range(readings_per_day):

                # Automatically cycle machine load
                if load == "AUTO":
                    load_cycle = reading_number % 3

                    if load_cycle == 0:
                        current_load = "IDLE"
                    elif load_cycle == 1:
                        current_load = "NORMAL"
                    else:
                        current_load = "HEAVY"

                else:
                    current_load = load

                # Generate base sensor reading
                reading = self.generator.generate_normal_reading(
                    season=current_season,
                    load=current_load
                )

                # Apply machine degradation
                if degradation_enabled:
                    reading = self.generator.apply_machine_degradation(
                        reading,
                        degradation
                    )

                # Historical timestamp
                timestamp = start_time + timedelta(
                    days=day - 1,
                    hours=reading_number
                )

                # Add simulation information
                reading["timestamp"] = timestamp
                reading["day"] = day
                reading["season"] = current_season
                reading["load"] = current_load
                reading["degradation"] = degradation

                data.append(reading)

        return data