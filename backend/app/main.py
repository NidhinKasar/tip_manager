from fastapi import FastAPI
from endpoints import auth, tips
from database import engine
from models import Base
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict
from fastapi.staticfiles import StaticFiles

Base.metadata.create_all(bind=engine)

app = FastAPI(title='tipmanager')
API_PREFIX: str = "/api"
# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # List the allowed origins (your frontend URL)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all HTTP headers
)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.include_router(auth.router ,prefix=API_PREFIX)
app.include_router(tips.router ,prefix=API_PREFIX)

@app.get("/", tags=["home"], response_model=Dict[str, str])
def root() -> Dict[str, str]:
    return {"name": 'tipmanager', "version": "1.0.0"}