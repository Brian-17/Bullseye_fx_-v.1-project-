from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database.init_db import init_db
from app.routes.auth import router as auth_router
from app.routes.trades import router as trades_router
from app.routes.dashboard import router as dashboard_router

app = FastAPI(
    title='Bullseye FX API',
    description='Backend API for Bullseye FX Trading Journal',
    version='1.0.0',
)

# CORS MUST come right after app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3002", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create database tables
init_db()

# Routes
app.include_router(auth_router)
app.include_router(trades_router)
app.include_router(dashboard_router)


@app.get("/")
def root():
    return {"message": "Welcome to Bullseye FX API 🚀"}


@app.get("/health")
def health():
    return {"status": "healthy"}
