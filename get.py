# -*- coding: utf-8 -*-
from fastapi import FastAPI,HTTPException,Depends
from fastapi.templating import Jinja2Templates
from starlette.requests import Request
from Schemas import TovarBase, TovarResponse
from base import SessionLocal,TovarDB
from pydantic import BaseModel
import psycopg2, psycopg2.extras
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

app = FastAPI()
templates = Jinja2Templates(directory="frontend")

def get_db():
    return psycopg2.connect(
        host="localhost", dbname="news",
        user="postgres", password="66YouTube66",
        cursor_factory=psycopg2.extras.RealDictCursor
    )

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
        "dilivery.html",
        {"request":request}
    )

@app.get("/sell")
async def sell_page(request: Request):
  return templates.TemplateResponse("sell.html", {"request": request})


@app.post("/sell", response_model=TovarResponse)
def sell(data: TovarBase, db: Session = Depends(get_db)):
    try:
        tovar = TovarDB(name=data.name, description=data.description)
        db.add(tovar)
        db.commit()
        db.refresh(tovar)
        return tovar
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))