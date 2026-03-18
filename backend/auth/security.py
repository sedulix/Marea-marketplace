from passlib.context import CryptContext


context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# THIS ONE FOR REGISTRATION
def hash_password(password: str):
    return context.hash(password[:72])


# THIS ONE FOR LOGIN
def verify_password(main_password, hashed_password):
    return context.verify(main_password, hashed_password)

