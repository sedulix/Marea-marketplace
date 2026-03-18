from fastapi import APIRouter, Depends, Request, HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from ..data.Database import get_db, User


router = APIRouter(prefix="/auth")


@router.get("/me")
def get_current_user(request: Request, db: Session = Depends(get_db)):
    username = request.cookies.get("user")

    if not username:
        raise HTTPException(status_code=401, detail="Не авторизован")

    user = db.query(User).filter(User.username == username).first()

    if not user:
        raise HTTPException(status_code=404, detail="Пользователь не найден")

    return JSONResponse({
        "user": user.username,
        "email": user.email
    })

