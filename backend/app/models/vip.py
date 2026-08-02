from sqlalchemy import Column, Integer, String, Boolean
from app.database.base import Base


class VIP(Base):
    __tablename__ = "vip_requests"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False)
    status = Column(String(50), default="Pending")
    approved = Column(Boolean, default=False)
