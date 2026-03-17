from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy import Column, String, Integer
from sqlalchemy import create_engine


DATA_BASE_URL = "postgresql://postgres:66YouTube66@localhost:5432/Tovars"
engine = create_engine(DATA_BASE_URL)

SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db

    finally:
        db.close()


class User(Base):
    __tablename__ = "Users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True)
    email = Column(String, unique=True)
    password = Column(String)


class Tovari(Base):
    __tablename__ = "Tovari"
    id = Column(Integer, primary_key=True)
    name = Column(String)
    desc = Column(String)


Base.metadata.create_all(bind=engine)

