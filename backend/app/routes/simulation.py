from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field

from app.simulator.historical_simulator import HistoricalSimulator


router = APIRouter(
    prefix="/simulation",
    tags=["Simulation"]
)


class SimulationRequest(BaseModel):
    days: int = Field(default=90, ge=1, le=90)
    season: str = "auto"
    load: str = "AUTO"
    degradation_enabled: bool = True


@router.post("/run")
def run_simulation(request: SimulationRequest):
    try:
        simulator = HistoricalSimulator()

        data = simulator.generate_data(
            days=request.days,
            readings_per_day=24,
            season=request.season,
            load=request.load,
            degradation_enabled=request.degradation_enabled,
        )

        return {
            "message": "Simulation generated successfully.",
            "days": request.days,
            "readings_generated": len(data),
            "readings_per_day": 24,
            "season": request.season,
            "load": request.load,
            "degradation_enabled": request.degradation_enabled,
            "first_reading": data[0] if data else None,
            "last_reading": data[-1] if data else None,
        }

    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error)
        )