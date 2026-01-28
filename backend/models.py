import time
import uuid
from sqlalchemy import Column, String, Text, Integer, BigInteger
from sqlalchemy.orm import declarative_base

Base = declarative_base()


class Paste(Base):
    __tablename__ = "pastes"

    id = Column(String(16), primary_key=True, default=lambda: uuid.uuid4().hex[:8])

    content = Column(Text, nullable=False)

    created_at = Column(
        BigInteger,
        nullable=False,
        default=lambda: int(time.time() * 1000)
    )

    # optional → NULL by default
    ttl_seconds = Column(Integer, nullable=True)
    max_views = Column(Integer, nullable=True)

    views = Column(Integer, nullable=False, default=0)
