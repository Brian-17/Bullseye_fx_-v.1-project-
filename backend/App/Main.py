from fastapi import FastAPI

from app.routes.auth import router as auth_router
from app.routes.vip import router as vip_router
from app.routes.trades import router as trades_router

app = FastAPI(
    title="Bullseye FX API",
    description="Backend API for Bullseye FX",
    version="1.0.0",
)

app.include_router(auth_router)
app.include_router(vip_router)
app.include_router(trades_router)


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
