import sys
from pathlib import Path

# Add parent directory to path to import models.py
sys.path.insert(0, str(Path(__file__).parent.parent))
# Add backend directory to path
sys.path.insert(0, str(Path(__file__).parent))

import html
import time
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Request
from fastapi.responses import HTMLResponse
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from sqlalchemy import text

from db import get_db
from models import Paste

router = APIRouter()


# -----------------------
# request schema
# -----------------------

class PasteCreate(BaseModel):
    content: str = Field(..., min_length=1)
    ttl_seconds: Optional[int] = Field(
        default=None,
        description="Expire after N seconds (must be > 0)"
    )
    max_views: Optional[int] = Field(
        default=None,
        description="Expire after N views (must be > 0)"
    )


# -----------------------
# deterministic time
# -----------------------

def now_ms(request: Request) -> int:
    if request.headers.get("x-test-now-ms"):
        return int(request.headers["x-test-now-ms"])
    return int(time.time() * 1000)


# -----------------------
# expiry logic
# -----------------------

def is_expired(paste: Paste, now: int) -> bool:

    if paste.ttl_seconds is not None:
        if now > paste.created_at + paste.ttl_seconds * 1000:
            return True

    if paste.max_views is not None:
        if paste.views >= paste.max_views:
            return True

    return False


# -----------------------
# health check
# -----------------------

@router.get("/api/healthz")
def healthz(db: Session = Depends(get_db)):
    db.execute(text("SELECT 1"))
    return {"ok": True}


# -----------------------
# create paste
# -----------------------

@router.post("/api/pastes")
def create_paste(
    payload: PasteCreate,
    db: Session = Depends(get_db)
):
    # accept only values > 0
    ttl = payload.ttl_seconds if payload.ttl_seconds and payload.ttl_seconds > 0 else None
    views = payload.max_views if payload.max_views and payload.max_views > 0 else None

    paste = Paste(
        content=payload.content,
        ttl_seconds=ttl,
        max_views=views
    )

    db.add(paste)
    db.commit()
    db.refresh(paste)

    return {
        "id": paste.id,
        "content": paste.content,
        "ttl_seconds": paste.ttl_seconds,
        "max_views": paste.max_views
    }


# -----------------------
# get paste JSON
# -----------------------

@router.get("/api/pastes/{paste_id}")
def get_paste_json(
    paste_id: str,
    request: Request,
    db: Session = Depends(get_db)
):
    paste = db.get(Paste, paste_id)
    if not paste:
        raise HTTPException(status_code=404)

    now = now_ms(request)

    if is_expired(paste, now):
        raise HTTPException(status_code=404)

    paste.views += 1
    db.commit()

    return {
        "id": paste.id,
        "content": paste.content,
        "views": paste.views
    }


# -----------------------
# HTML view
# -----------------------

@router.get("/p/{paste_id}", response_class=HTMLResponse)
def get_paste_html(
    paste_id: str,
    request: Request,
    db: Session = Depends(get_db)
):
    paste = db.get(Paste, paste_id)
    if not paste:
        raise HTTPException(status_code=404)

    now = now_ms(request)

    if is_expired(paste, now):
        raise HTTPException(status_code=404)

    paste.views += 1
    db.commit()

    safe = html.escape(paste.content)

    return f"""
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8"/>
<title>Paste {paste.id}</title>
<style>
body {{
    background:#0f0f0f;
    color:#eee;
    font-family:monospace;
    padding:30px;
}}
pre {{
    background:#1e1e1e;
    padding:20px;
    border-radius:8px;
    white-space:pre-wrap;
}}
</style>
</head>
<body>
<h3>Paste ID: {paste.id}</h3>
<pre>{safe}</pre>
</body>
</html>
"""
