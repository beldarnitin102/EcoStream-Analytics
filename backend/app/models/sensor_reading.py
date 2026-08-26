from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class SensorReading(Base):
    __tablename__ = "sensor_readings"

    id: Mapped[int] = mapped_column(
        primary_key=True,
        index=True
    )

    machine_id: Mapped[int] = mapped_column(
        ForeignKey("machines.id"),
        nullable=False,
        index=True
    )

    timestamp: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        index=True
    )

    temperature: Mapped[float] = mapped_column(
        Float,
        nullable=False
    )

    vibration: Mapped[float] = mapped_column(
        Float,
        nullable=False
    )

    voltage: Mapped[float] = mapped_column(
        Float,
        nullable=False
    )

    current: Mapped[float] = mapped_column(
        Float,
        nullable=False
    )

    power: Mapped[float] = mapped_column(
        Float,
        nullable=False
    )

    machine = relationship(
        "Machine",
        back_populates="sensor_readings"
    )