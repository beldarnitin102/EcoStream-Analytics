import threading

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from app.core.database import engine
from app.routes.factory import router as factory_router
from app.routes.machine import router as machine_router
from app.routes.sensor_reading import router as sensor_reading_router
from app.routes.anomaly import router as anomaly_router
from app.routes.live_data import router as live_data_router
from app.models import Factory, Machine, SensorReading
from app.simulator.live_database import LiveDatabaseSimulator


app = FastAPI(title="EcoTwin API")


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def start_live_simulator():
    simulator = LiveDatabaseSimulator(machine_id=1)

    simulator_thread = threading.Thread(
        target=simulator.run,
        daemon=True
    )

    simulator_thread.start()

    print("EcoTwin live simulator started.")


@app.get("/")
def root():
    return {"message": "EcoTwin API is running"}


@app.get("/db-test")
def database_test():
    with engine.connect() as connection:
        result = connection.execute(text("SELECT 1"))

        return {
            "database": "connected",
            "result": result.scalar(),
        }


app.include_router(factory_router)
app.include_router(machine_router)
app.include_router(sensor_reading_router)
app.include_router(anomaly_router)
app.include_router(live_data_router)