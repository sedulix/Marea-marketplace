from fastapi import APIRouter, Depends, Response, HTTPException
from sqlalchemy.orm import Session

from .security import hash_password
from ..data.Database import get_db, User
from ..schemas.schemas import RegisterData


router = APIRouter(prefix="/auth")


@router.post("/registration")
def register(data: RegisterData, response: Response, db: Session = Depends(get_db)):
    hashed_password = hash_password(data.password)

    existing_username = db.query(User).filter(User.username == data.username).first()
    if existing_username:
        raise HTTPException(status_code=400, detail="Пользователь уже существует")

    existing_email = db.query(User).filter(User.email == data.email).first()
    if existing_email:
        raise HTTPException(status_code=400, detail="Email уже используется")


    new_user = User(
        username = data.username,
        email = data.email,
        password = hashed_password
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    response.set_cookie(
        key = "user",
        value = new_user.username,
        path = "/",
        httponly = True,
        max_age = 60 * 60 * 24 * 7
    )

    return {"status": "ok"}

