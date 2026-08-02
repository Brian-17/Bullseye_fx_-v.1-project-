from fastapi import APIRouter

router = APIRouter(
    prefix="/trades",
    tags=["Trades"]
)

@router.get("/")
def get_trades():
    return {
        "message": "List of all trades"
    }

@router.post("/")
def create_trade():
    return {
        "message": "Trade created successfully"
    }
