from pydantic import BaseModel


class TovarBase(BaseModel):
    description:str
    name:str


class Tovar(TovarBase):
    pass


class TovarResponse(TovarBase):
    class Config:
        orm_mode = True

