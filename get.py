from fastapi.templating import Jinja2Templates
from starlette.requests import Request
from fastapi import FastAPI

from backend.auth import registration, login, logout, auth_me
from backend.sell_process import sell


templates = Jinja2Templates(directory="frontend")


app = FastAPI()
app.include_router(registration.router)
app.include_router(login.router)
app.include_router(logout.router)
app.include_router(auth_me.router)
app.include_router(sell.router)


@app.get("/")
def home(request:Request):
    return templates.TemplateResponse(
        "home.html",
        {"request": request}
    )


@app.get("/registration")
async def catalog(request:Request):
    return templates.TemplateResponse(
        "registration.html",
        {"request":request}
    )


@app.get("/login")
async def catalog(request:Request):
    return templates.TemplateResponse(
        "login.html",
        {"request":request}
    )


@app.get("/account_page")
async def catalog(request:Request):
    return templates.TemplateResponse(
        "account_page.html",
        {"request":request}
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
async def delivery(request:Request):
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


@app.get("/cart")
async def cart(request:Request):
    return templates.TemplateResponse(
        "cart.html",
        {"request": request}
    )

