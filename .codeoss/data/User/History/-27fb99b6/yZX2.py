from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.auth import UserRegister
from app.utils.security import hash_password, verify_password


def register_user(db: Session, user: UserRegister):
    existing_user = db.query(User).filter(User.email == user.email).first()

        if existing_user:
                return None

                    hashed_password = hash_password(user.password)

                        new_user = User(
                                username=user.username,
                                        email=user.email,
                                                hashed_password=hashed_password
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