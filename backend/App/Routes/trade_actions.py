from fastapi import APIRouter

router = APIRouter(
    prefix="/trade",
    tags=["Trade Actions"]
)

@router.delete("/{trade_id}")
def delete_trade(trade_id: int):
    return {
        "message": f"Trade {trade_id} deleted successfully"
    }

@router.put("/{trade_id}")
def update_trade(trade_id: int):
    return {
        "message": f"Trade {trade_id} updated successfully"
}
