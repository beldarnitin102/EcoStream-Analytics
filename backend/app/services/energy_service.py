from datetime import datetime, timedelta, timezone
from math import pi, sin

from sqlalchemy.orm import Session

from app.models.sensor_reading import SensorReading


# These are simulation assumptions for EcoTwin.
# They can be moved to configuration later.
GRID_TARIFF_INR_PER_KWH = 8.0
SOLAR_TARIFF_INR_PER_KWH = 0.0
GRID_CO2_FACTOR_KG_PER_KWH = 0.70
SOLAR_CAPACITY_KW = 10.0

# Assume a portion of grid energy can be shifted toward
# periods with available solar energy.
SHIFTABLE_ENERGY_SHARE = 0.30


class EnergyService:
    def __init__(self, db: Session):
        self.db = db

    def calculate_energy(
        self,
        machine_id: int,
        days: int = 1,
    ):
        now_utc = datetime.now(timezone.utc).replace(tzinfo=None)
        start_time = now_utc - timedelta(days=days)

        readings = (
            self.db.query(SensorReading)
            .filter(
                SensorReading.machine_id == machine_id,
                SensorReading.timestamp >= start_time,
                SensorReading.timestamp <= now_utc,
            )
            .order_by(SensorReading.timestamp.asc())
            .all()
        )

        if not readings:
            return {
                "machine_id": machine_id,
                "period_days": days,
                "message": "No sensor data available for the selected period.",
                "current_power_kw": 0.0,
                "total_energy_kwh": 0.0,
                "solar_energy_kwh": 0.0,
                "grid_energy_kwh": 0.0,
                "solar_share_percent": 0.0,
                "grid_share_percent": 0.0,
                "idle_waste_kwh": 0.0,
                "current_cost_inr": 0.0,
                "optimized_cost_inr": 0.0,
                "cost_saving_inr": 0.0,
                "current_co2_kg": 0.0,
                "optimized_co2_kg": 0.0,
                "co2_reduction_kg": 0.0,
            }

        current_power_kw = round(readings[-1].power / 1000, 2)

        total_energy_kwh = 0.0
        solar_energy_kwh = 0.0
        grid_energy_kwh = 0.0
        solar_spare_kwh = 0.0

        for previous, current in zip(readings, readings[1:]):
            delta_hours = (
                current.timestamp - previous.timestamp
            ).total_seconds() / 3600

            # Ignore large gaps in the dataset.
            # This prevents missing-data periods from being
            # counted as continuous machine operation.
            if delta_hours <= 0 or delta_hours > 2:
                continue

            average_power_kw = (
                previous.power + current.power
            ) / 2 / 1000

            interval_energy_kwh = average_power_kw * delta_hours

            # Use the midpoint timestamp to estimate solar availability.
            midpoint = previous.timestamp + (
                current.timestamp - previous.timestamp
            ) / 2

            solar_factor = self._solar_availability(midpoint)

            solar_available_kwh = (
                SOLAR_CAPACITY_KW
                * solar_factor
                * delta_hours
            )

            solar_used_kwh = min(
                interval_energy_kwh,
                solar_available_kwh,
            )

            grid_used_kwh = (
                interval_energy_kwh - solar_used_kwh
            )

            spare_solar_kwh = max(
                solar_available_kwh - solar_used_kwh,
                0.0,
            )

            total_energy_kwh += interval_energy_kwh
            solar_energy_kwh += solar_used_kwh
            grid_energy_kwh += grid_used_kwh
            solar_spare_kwh += spare_solar_kwh

        # A simple optimization scenario:
        # move a configurable portion of grid energy into
        # available unused solar capacity.
        shiftable_energy_kwh = (
            grid_energy_kwh * SHIFTABLE_ENERGY_SHARE
        )

        shifted_to_solar_kwh = min(
            shiftable_energy_kwh,
            solar_spare_kwh,
        )

        optimized_solar_energy_kwh = (
            solar_energy_kwh + shifted_to_solar_kwh
        )

        optimized_grid_energy_kwh = max(
            grid_energy_kwh - shifted_to_solar_kwh,
            0.0,
        )

        current_cost_inr = (
            grid_energy_kwh * GRID_TARIFF_INR_PER_KWH
            + solar_energy_kwh * SOLAR_TARIFF_INR_PER_KWH
        )

        optimized_cost_inr = (
            optimized_grid_energy_kwh * GRID_TARIFF_INR_PER_KWH
            + optimized_solar_energy_kwh * SOLAR_TARIFF_INR_PER_KWH
        )

        current_co2_kg = (
            grid_energy_kwh * GRID_CO2_FACTOR_KG_PER_KWH
        )

        optimized_co2_kg = (
            optimized_grid_energy_kwh
            * GRID_CO2_FACTOR_KG_PER_KWH
        )

        total_energy_kwh = round(total_energy_kwh, 2)
        solar_energy_kwh = round(solar_energy_kwh, 2)
        grid_energy_kwh = round(grid_energy_kwh, 2)

        solar_share_percent = (
            solar_energy_kwh / total_energy_kwh * 100
            if total_energy_kwh > 0
            else 0
        )

        grid_share_percent = (
            grid_energy_kwh / total_energy_kwh * 100
            if total_energy_kwh > 0
            else 0
        )

        return {
            "machine_id": machine_id,
            "period_days": days,
            "current_power_kw": current_power_kw,
            "total_energy_kwh": total_energy_kwh,
            "solar_energy_kwh": solar_energy_kwh,
            "grid_energy_kwh": grid_energy_kwh,
            "solar_share_percent": round(solar_share_percent, 1),
            "grid_share_percent": round(grid_share_percent, 1),
            "idle_waste_kwh": 0.0,
            "current_cost_inr": round(current_cost_inr, 2),
            "optimized_cost_inr": round(optimized_cost_inr, 2),
            "cost_saving_inr": round(
                current_cost_inr - optimized_cost_inr,
                2,
            ),
            "current_co2_kg": round(current_co2_kg, 2),
            "optimized_co2_kg": round(optimized_co2_kg, 2),
            "co2_reduction_kg": round(
                current_co2_kg - optimized_co2_kg,
                2,
            ),
            "assumptions": {
                "grid_tariff_inr_per_kwh": GRID_TARIFF_INR_PER_KWH,
                "solar_tariff_inr_per_kwh": SOLAR_TARIFF_INR_PER_KWH,
                "grid_co2_factor_kg_per_kwh": GRID_CO2_FACTOR_KG_PER_KWH,
                "solar_capacity_kw": SOLAR_CAPACITY_KW,
                "shiftable_energy_share_percent":
                    SHIFTABLE_ENERGY_SHARE * 100,
            },
        }

    def _solar_availability(self, timestamp: datetime) -> float:
        """
        Estimate solar availability from time of day.

        Sensor timestamps are stored as UTC.
        Convert them to India Standard Time before calculating
        the daylight curve.
        """

        utc_timestamp = timestamp.replace(
            tzinfo=timezone.utc
        )

        ist_timestamp = utc_timestamp.astimezone(
            timezone(timedelta(hours=5, minutes=30))
        )

        hour = (
            ist_timestamp.hour
            + ist_timestamp.minute / 60
            + ist_timestamp.second / 3600
        )

        # No modeled solar generation before 6 AM or after 6 PM.
        if hour < 6 or hour > 18:
            return 0.0

        # Smooth daylight curve:
        # 0 at 6 AM → peak around noon → 0 at 6 PM.
        solar_factor = sin(
            pi * (hour - 6) / 12
        )

        return max(0.0, solar_factor)