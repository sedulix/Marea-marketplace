from pydantic import BaseModel


class RegisterData(BaseModel):
    username: str
    email: str
    password: str


class LoginData(BaseModel):
    username: str
    password: str


class TovarBase(BaseModel):
    description: str
    name: str


class Tovar(TovarBase):
    pass


class TovarResponse(TovarBase):
    model_config = {
        "from_attributes": True
    }

