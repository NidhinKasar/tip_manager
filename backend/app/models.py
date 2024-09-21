from sqlalchemy import Column, Integer, Float, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Tip(Base):
    __tablename__ = "tips"
    id = Column(Integer, primary_key=True, index=True)
    place = Column(String, index=True)
    total_amount = Column(Float, nullable=False)
    tip_amount = Column(Float, nullable=False)
    time = Column(DateTime, default=datetime.utcnow)

    # Foreign key to link each tip to a specific user
    user_id = Column(Integer, ForeignKey("users.id"))
    
    # Relationship to user
    user = relationship("User", back_populates="tips")

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String, nullable=False)
    profile_image = Column(String, nullable=True)

    # Relationship to tips
    tips = relationship("Tip", back_populates="user")
