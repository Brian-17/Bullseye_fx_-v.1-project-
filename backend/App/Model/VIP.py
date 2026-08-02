from pydantic import BaseModel

class VIPRequest(BaseModel):
    user_id: int
    broker_name: str
    trading_account: str
    status: str = "Pending"
