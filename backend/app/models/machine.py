from datetime import datetime

from sqlalchemy import (
    DateTime,
    Float,
    ForeignKey,
    String
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class Machine(Base):
    __tablename__ = "machines"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True
    )

    factory_id: Mapped[int] = mapped_column(
        ForeignKey("factories.id"),
        nullable=False,
        index=True
    )

    name: Mapped[str] = mapped_column(
        String(100),
        nullable=False
    )

    machine_code: Mapped[str] = mapped_column(
        String(50),
        unique=True,
        nullable=False
    )

    machine_type: Mapped[str] = mapped_column(
        String(50),
        nullable=False
    )

    status: Mapped[str] = mapped_column(
        String(20),
        default="IDLE"
    )

    health_score: Mapped[float] = mapped_column(
        Float,
        default=100.0
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow
    )

    factory = relationship(
        "Factory",
        back_populates="machines"
    )

    sensor_readings = relationship(
    "SensorReading",
    back_populates="machine",
    cascade="all, delete-orphan"
)