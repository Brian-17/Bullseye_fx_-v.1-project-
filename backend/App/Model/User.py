from pydantic import BaseModel, EmailStr

class User(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    username: str
    role: str = "member"
    vip: bool = False
