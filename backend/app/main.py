from fastapi import FastAPI
from sqlalchemy import text

from app.core.database import engine
from app.routes.factory import router as factory_router
from app.models import Factory, Machine, SensorReading
from app.routes.machine import router as machine_router
from app.routes.sensor_reading import router as sensor_reading_router

app = FastAPI(title="EcoTwin API")


@app.get("/")
def root():
    return {
        "message": "EcoTwin API is running"
    }


@app.get("/db-test")
def database_test():
    with engine.connect() as connection:
        result = connection.execute(text("SELECT 1"))
        return {
            "database": "connected",
            "result": result.scalar()
        }


app.include_router(factory_router)
app.include_router(machine_router)
app.include_router(sensor_reading_router)