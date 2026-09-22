from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.services.energy_service import EnergyService


router = APIRouter(
    prefix="/energy",
    tags=["Energy & CO₂"]
)


@router.get("/{machine_id}")
def get_energy_data(
    machine_id: int,
    days: int = 1,
    db: Session = Depends(get_db)
):
    if days < 1 or days > 90:
        raise HTTPException(
            status_code=400,
            detail="Days must be between 1 and 90."
        )

    service = EnergyService(db)

    return service.calculate_energy(
        machine_id=machine_id,
        days=days,
    )