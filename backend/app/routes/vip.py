from fastapi import APIRouter

router = APIRouter(
    prefix="/vip",
    tags=["VIP"]
)


@router.post("/request")
def request_vip():
    return {
        "message": "VIP request submitted"
    }


@router.get("/status")
def vip_status():
    return {
        "status": "Pending"
    }


@router.post("/approve")
def approve_vip():
    return {
        "message": "VIP approved"
    }
