from app.utils.security import hash_password
from app.utils.jwt import create_access_token


def register_user(user):
    hashed = hash_password(user.password)

    return {
        "message": "User registered",
        "hashed_password": hashed
    }


def login_user(user):
    token = create_access_token(
        {
            "email": user.email
        }
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }
