from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, Form
from sqlalchemy.orm import Session
from database import SessionLocal
from models import User
from passlib.hash import bcrypt
from pydantic import BaseModel
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import Generator
import os

# Router for user-related endpoints
router = APIRouter()

# JWT settings
SECRET_KEY = "9745713706"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Pydantic schemas for request bodies
class UserCreate(BaseModel):
    name: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

# Utility function to generate JWT tokens
def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_db() -> Generator:
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()

# Utility function to save the uploaded file
# Utility function to save the uploaded file and return its URL path
def save_image(file: UploadFile) -> str:
    upload_folder = "uploads/"  # Directory to save uploaded images
    os.makedirs(upload_folder, exist_ok=True)  # Create directory if it doesn't exist
    file_path = os.path.join(upload_folder, file.filename)
    
    with open(file_path, "wb") as buffer:
        buffer.write(file.file.read())
    
    # Return the URL to access the image
    return f"/uploads/{file.filename}"  # This URL can be accessed via FastAPI

# Signup route for new user registration
@router.post("/user", status_code=201)
def signup(
    name: str = Form(...),
    email: str = Form(...),
    password: str = Form(...),
    proPic: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    # Validate fields manually
    if not name or len(name) < 3:
        raise HTTPException(status_code=400, detail={"message": "invalid field (name)"})
    if "@" not in email:
        raise HTTPException(status_code=400, detail={"message": "invalid field (email)"})
    if len(password) < 6:
        raise HTTPException(status_code=400, detail={"message": "invalid field (password)"})

    user = db.query(User).filter(User.email == email).first()
    if user:
        raise HTTPException(status_code=400, detail={"message": "Email already registered"})

    # Hash the password and create the new user
    hashed_password = bcrypt.hash(password)
    new_user = User(name=name, email=email, hashed_password=hashed_password)

    # Save image and store its path in the DB
    image_path = save_image(proPic)
    new_user.profile_image = image_path

    # Save new user to the database
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    # Generate JWT token
    access_token = create_access_token(data={"sub": new_user.email})

    return {
        "name": new_user.name,
        "token": access_token
    }
    
# Login route for existing users
@router.post("/user/login", status_code=200)
def login(user_data: UserLogin, db: Session = Depends(get_db)):
    # Query the user by email
    user = db.query(User).filter(User.email == user_data.email).first()

    # Verify user existence and password
    if not user or not bcrypt.verify(user_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail={"message": "Invalid credentials"})

    # Generate JWT token
    access_token = create_access_token(data={"sub": user.email})
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "message": "Login successful",
        "name": user.name,
        "email": user.email,
        "profile_picture": user.profile_image,
        "user_id": user.id
    }
