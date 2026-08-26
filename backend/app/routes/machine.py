from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.machine import Machine

router = APIRouter(
    prefix="/machines",
    tags=["Machines"]
)


@router.post("/")
def create_machine(
    factory_id: int,
    name: str,
    machine_code: str,
    machine_type: str,
    db: Session = Depends(get_db)
):
    machine = Machine(
        factory_id=factory_id,
        name=name,
        machine_code=machine_code,
        machine_type=machine_type
    )

    db.add(machine)
    db.commit()
    db.refresh(machine)

    return machine

@router.get("/")
def get_machines(
    db: Session = Depends(get_db)
):
    machines = db.query(Machine).all()

    return machines