import random


class SensorGenerator:

    def generate_normal_reading(self):
        temperature = random.uniform(60, 70)
        vibration = random.uniform(1.5, 2.5)
        voltage = random.uniform(228, 232)
        current = random.uniform(7.5, 9.0)

        power = voltage * current

        return {
            "temperature": round(temperature, 2),
            "vibration": round(vibration, 2),
            "voltage": round(voltage, 2),
            "current": round(current, 2),
            "power": round(power, 2)
        }