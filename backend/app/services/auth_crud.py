from sqlalchemy.orm import Session

from app.models.user import User
from app.models.trade import Trade
from app.schemas.auth import UserRegister
from app.schemas.trade import TradeCreate
from app.utils.security import hash_password, verify_password


# ===== AUTH FUNCTIONS =====
def register_user(db: Session, user: UserRegister):
    existing = db.query(User).filter(User.email == user.email).first()

    if existing:
        return None

    new_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hash_password(user.password),
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


def authenticate_user(db: Session, email: str, password: str):
    user = db.query(User).filter(User.email == email).first()

    if not user:
        return None

    if not verify_password(password, user.hashed_password):
        return None

    return user


# ===== TRADE FUNCTIONS =====
def create_trade(db: Session, trade: TradeCreate, user_id: int):
    db_trade = Trade(
        **trade.model_dump(),
        user_id=user_id,
    )

    db.add(db_trade)
    db.commit()
    db.refresh(db_trade)

    return db_trade


def get_trades(
    db: Session,
    user_id: int,
    pair: str | None = None,
    result: str | None = None,
    strategy: str | None = None,
    session: str | None = None,
    search: str | None = None,
    skip: int = 0,
    limit: int = 20,
):
    query = db.query(Trade).filter(Trade.user_id == user_id)

    if pair:
        query = query.filter(Trade.pair == pair)
    if result:
        query = query.filter(Trade.result == result)
    if strategy:
        query = query.filter(Trade.strategy == strategy)
    if session:
        query = query.filter(Trade.session == session)
    if search:
        query = query.filter(Trade.notes.ilike(f"%{search}%"))

    return query.offset(skip).limit(limit).all()


def get_trade(db: Session, trade_id: int, user_id: int):
    return (
        db.query(Trade)
        .filter(Trade.id == trade_id, Trade.user_id == user_id)
        .first()
    )


def update_trade(db: Session, trade_id: int, trade: TradeCreate, user_id: int):
    db_trade = get_trade(db, trade_id, user_id)

    if db_trade is None:
        return None

    for key, value in trade.model_dump().items():
        setattr(db_trade, key, value)

    db.commit()
    db.refresh(db_trade)

    return db_trade


def delete_trade(db: Session, trade_id: int, user_id: int):
    db_trade = get_trade(db, trade_id, user_id)

    if db_trade is None:
        return None

    db.delete(db_trade)
    db.commit()

    return db_trade
