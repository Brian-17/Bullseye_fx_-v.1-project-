from fastapi import FastAPI
from app.routes.auth import router as auth_router

app = FastAPI(
    title="Bullseye FX API",
    version="1.0.0"
)

app.include_router(auth_router)

@app.get("/")
def root():
    return {
        "message": "Welcome to Bullseye FX API"
    }

@app.get("/health")
def health():
    return {
        "status": "healthy"
    }
