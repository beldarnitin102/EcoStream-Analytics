from fastapi import FastAPI
from sqlalchemy import text

from app.core.database import engine

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