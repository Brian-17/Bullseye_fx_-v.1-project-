from fastapi import FastAPI

from app.database.init_db import init_db

init_db()

app = FastAPI(
    title="Bullseye FX API",
    version="1.0.0",
    description="Backend API for Bullseye FX"
)


@app.get("/")
def root():
    return {
        "message": "Welcome to Bullseye FX API 🚀"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }
