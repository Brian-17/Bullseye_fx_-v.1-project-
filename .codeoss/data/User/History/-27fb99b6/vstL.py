from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.auth import UserRegister
from app.utils.security import hash_password, verify_password


    existing_user = (
            db.query(User)
                                   username=user.username,
                                                                email=user.email,
                                                                        hashed_password=hash_password(user.password),
                                                                            )

                                                                                db.add(new_user)
                                                                                    db.commit()
                                                                                        db.refresh(new_user)

                                                                                            return new_user


                                                                                            def authenticate_user(db: Session, email: str, password: str):
                                                                                                user = (
                                                                                                        db.query(User)
                                                                                                                .filter(User.email == email)
                                                                                                                        .first()
                                                                                                                            )

                                                                                                                                if user is None:
                                                                                                                                        return None

                                                                                                                                            if not verify_password(password, user.hashed_password):
                                                                                                                                                    return None

                                                                                                                                                        return user