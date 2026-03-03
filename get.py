from fastapi import FastAPI
from fastapi.templating import Jinja2Templates
from starlette.requests import Request


app = FastAPI()
templates = Jinja2Templates(directory="frontend")


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

