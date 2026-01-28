import sys
from pathlib import Path

# Add parent directory to path to import models.py
sys.path.insert(0, str(Path(__file__).parent.parent))
# Add backend directory to path
sys.path.insert(0, str(Path(__file__).parent))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from db import engine
from models import Base
from routes import router

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Pastebin Lite")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)


