import random


class SensorGenerator:

    def generate_normal_reading(
        self,
        season="normal",
        load="NORMAL"
    ):
        # -------------------------
        # Base normal values
        # -------------------------
        temperature = random.uniform(60, 70)
        vibration = random.uniform(1.5, 2.5)
        voltage = random.uniform(228, 232)
        current = random.uniform(7.5, 9.0)

        # -------------------------
        # Seasonal effect
        # -------------------------
        if season == "summer":
            temperature += random.uniform(5, 10)

        elif season == "monsoon":
            temperature += random.uniform(1, 4)

        elif season == "winter":
            temperature -= random.uniform(3, 6)

        # -------------------------
        # Machine load effect
        # -------------------------
        if load == "IDLE":
            temperature -= random.uniform(5, 8)
            current -= random.uniform(2, 3)
            vibration -= random.uniform(0.3, 0.6)

        elif load == "HEAVY":
            temperature += random.uniform(5, 10)
            current += random.uniform(2, 4)
            vibration += random.uniform(0.3, 0.8)

        # -------------------------
        # Calculate power
        # -------------------------
        power = voltage * current

        return {
            "temperature": round(temperature, 2),
            "vibration": round(vibration, 2),
            "voltage": round(voltage, 2),
            "current": round(current, 2),
            "power": round(power, 2)
        }

    def calculate_degradation(self, day, total_days=90):
        """
        Calculate machine degradation based on simulation day.

        0.0 = Healthy
        1.0 = Critical
        """

        degradation_level = day / total_days

        # Keep degradation between 0 and 1
        degradation_level = min(degradation_level, 1.0)

        return round(degradation_level, 2)

    def apply_machine_degradation(self, reading, degradation_level):
        # -------------------------
        # Temperature degradation
        # -------------------------
        reading["temperature"] += random.uniform(
            0,
            15 * degradation_level
        )

        # -------------------------
        # Vibration degradation
        # -------------------------
        reading["vibration"] += random.uniform(
            0,
            2.0 * degradation_level
        )

        # -------------------------
        # Current degradation
        # -------------------------
        reading["current"] += random.uniform(
            0,
            3.0 * degradation_level
        )

        # -------------------------
        # Recalculate power
        # -------------------------
        reading["power"] = (
            reading["voltage"] *
            reading["current"]
        )

        # -------------------------
        # Round values
        # -------------------------
        reading["temperature"] = round(
            reading["temperature"], 2
        )

        reading["vibration"] = round(
            reading["vibration"], 2
        )

        reading["current"] = round(
            reading["current"], 2
        )

        reading["power"] = round(
            reading["power"], 2
        )

        return reading