from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy import create_engine
from sqlalchemy import Column, String, Integer


DATA_BASE_URL = "postgresql://postgres:66YouTube66@localhost:5432/Tovars"
engine = create_engine(DATA_BASE_URL)

SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()


class Tovari(Base):
    __tablename__ = "Tovari"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    desc = Column(String)


Base.metadata.create_all(bind=engine)

