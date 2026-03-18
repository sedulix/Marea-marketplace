from fastapi.responses import RedirectResponse
from fastapi import APIRouter


router = APIRouter(prefix="/auth")


@router.post("/logout")
async def logout():
    response = RedirectResponse(url="/", status_code=303)
    response.delete_cookie("user", path = "/")
    return response

