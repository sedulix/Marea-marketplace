from fastapi import FastAPI, Depends
from fastapi.templating import Jinja2Templates
from starlette.requests import Request
from Database import SessionLocal,Tovari
from Schemas import Tovar
from sqlalchemy.orm import Session

app = FastAPI()
templates = Jinja2Templates(directory="frontend")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def home(request:Request):
    return templates.TemplateResponse(
        "home.html",
        {"request": request}
    )


@app.get("/catalog")
async def catalog(request:Request):
    return templates.TemplateResponse(
        "catalog.html",
        {"request":request}
    )


@app.get("/actions")
async def actions(request:Request):
    return templates.TemplateResponse(
        "actions.html",
        {"request": request}
    )


@app.get("/delivery")
async def dilivery(request:Request):
    return templates.TemplateResponse(
        "delivery.html",
        {"request":request}
    )

@app.get("/sell")
async def sel(request:Request):
    return templates.TemplateResponse(
        "sell.html",
        {"request":request}
    )

@app.post("/sell")
async def sell(tovar:Tovar,db: Session = Depends(get_db)):
    new_tovar = Tovari(name=tovar.name,desc=tovar.description)
    db.add(new_tovar)
    db.commit()
    db.refresh(new_tovar)
    return new_tovar