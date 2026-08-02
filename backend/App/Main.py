from fastapi import FastAPI

app = FastAPI(
    title="Bullseye FX API",
    description="Backend API for Bullseye FX Platform",
    version="1.0.0"
)

@app.get("/")
def root():
    return {
        "message": "Welcome to Bullseye FX API",
        "status": "running"
    }

@app.get("/health")
def health():
    return {
        "status": "healthy"
    }
