from typing import Generator, List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from database import SessionLocal
from models import Tip, User
from datetime import datetime
from sqlalchemy import and_
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt

router = APIRouter()

SECRET_KEY = "9745713706"
ALGORITHM = "HS256"
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


def get_db() -> Generator:
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("sub")
        if user_id is None:
            raise credentials_exception
        
        # Check if the session token matches
        user = db.query(User).filter(User.id == user_id).first()
        if user is None or user.session_token != token:
            raise credentials_exception

    except JWTError:
        raise credentials_exception
    return user_id

def parse_date(date_str: str):
    try:
        return datetime.strptime(date_str, '%Y-%m-%d')
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid date format. Use dd-mm-yyyy"
        )


@router.post("/tip/calculate", status_code=200)
def calculate_tip(
    place: str,
    total_amount: float,
    percentage: float,
    user_id: int = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Check if the user exists
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Calculate the tip amount
    tip_amount = total_amount * (percentage / 100)

    # Create a new tip entry linked to the user
    new_tip = Tip(
        place=place,
        total_amount=total_amount,
        tip_amount=tip_amount,
        time=datetime.now(),
        user_id=user_id,  # Attach the tip to the specific user
    )

    # Save the tip entry to the database
    db.add(new_tip)
    db.commit()
    db.refresh(new_tip)

    return {
        "user_id": user_id,
        "place": place,
        "total_amount": total_amount,
        "tip_amount": tip_amount,
    }


@router.get("/tip", response_model=List[dict], status_code=200)
def get_all_tips(
    startDate: str = Query(None),
    endDate: str = Query(None),
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user),
):
    start_date = parse_date(startDate) if startDate else None
    end_date = parse_date(endDate) if endDate else None

    # Query all tips related to the user
    query = db.query(Tip).filter(Tip.user_id == user_id)
    
    if start_date and end_date:
        query = query.filter(and_(Tip.time >= start_date, Tip.time <= end_date))
    elif start_date:
        query = query.filter(Tip.time >= start_date)
    elif end_date:
        query = query.filter(Tip.time <= end_date)

    tips = query.all()
    # If no tips are found for the user
    if not tips:
        return []

    # Map the result to the required format
    response = [
        {
            "id": tip.id,
            "amount": tip.total_amount,
            "percentage": round((tip.tip_amount / tip.total_amount) * 100, 2),
            "tip": tip.tip_amount,
            "place": tip.place,
            "created_on": tip.time.strftime("%Y-%m-%d %H:%M:%S"),
        }
        for tip in tips
    ]

    return response

@router.delete("/tip/delete", response_model=List[dict], status_code=200)
def delete_tip(
    tip_id: int,
    db: Session = Depends(get_db)
):
    rep = db.query(Tip).filter(Tip.id == tip_id).delete()
    db.commit()
    db.close()
    if(rep):
        return {
            "message": f"{rep} tip(s) deleted successfully"
        }
    else:
        return {
            "message": "No tip found with given ID"
        }