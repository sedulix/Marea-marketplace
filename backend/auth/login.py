from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from .security import verify_password
from ..data.Database import get_db, User
from ..schemas.schemas import LoginData


router = APIRouter(prefix="/auth")


@router.post("/login")
def login(data: LoginData, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == data.username).first()

    if not user or not verify_password(data.password, user.password):
        raise HTTPException(status_code=400, detail="Неверный логин или пароль")

    response = JSONResponse({"Status": "ok"})
    response.set_cookie(
        key = "user",
        value = user.username,
        httponly = True,
        max_age = 60 * 60 * 24 * 7
    )

    return response
