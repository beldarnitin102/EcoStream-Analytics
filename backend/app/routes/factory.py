from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.factory import Factory

router = APIRouter(
    prefix="/factories",
    tags=["Factories"]
)


@router.post("/")
def create_factory(
    name: str,
    location: str,
    db: Session = Depends(get_db)
):
    factory = Factory(
        name=name,
        location=location
    )

    db.add(factory)
    db.commit()
    db.refresh(factory)

    return factory