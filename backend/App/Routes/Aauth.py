from fastapi import APIRouter
from app.schemas.auth import RegisterRequest, LoginRequest
from app.services.auth_service import register_user, login_user

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)

@router.post("/register")
def register(user: RegisterRequest):
    return register_user(user)

@router.post("/login")
def login(user: LoginRequest):
    return login_user(user)

@router.get("/profile")
def profile():
    return {
        "message": "User profile"
    }
