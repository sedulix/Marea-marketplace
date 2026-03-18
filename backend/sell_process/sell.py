from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from ..data.Database import get_db, Tovari
from ..schemas.schemas import Tovar


router = APIRouter(prefix="/sell_process")


@router.post("/sell")
async def sell(tovar: Tovar, db: Session = Depends(get_db)):
    new_tovar = Tovari(name=tovar.name, desc=tovar.description)

    db.add(new_tovar)
    db.commit()
    db.refresh(new_tovar)

    return new_tovar

