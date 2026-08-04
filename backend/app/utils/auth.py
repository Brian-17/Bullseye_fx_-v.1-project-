from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session
import jwt

from app.database.dependencies import get_db
from app.models.user import User
from app.utils.security import SECRET_KEY, ALGORITHM

security = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
):
    token = credentials.credentials

    try:
    payload = jwt.decode(
        token,
        SECRET_KEY,
        algorithms=[ALGORITHM],
    )
    print("PAYLOAD:", payload)
    user_id = int(payload["sub"])

except Exception as e:
    print("JWT ERROR:", repr(e))
    raise HTTPException(status_code=401, detail="Invalid token")
