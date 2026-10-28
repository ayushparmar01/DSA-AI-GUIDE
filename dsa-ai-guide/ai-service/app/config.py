"""
AI Service Configuration
"""

import os
from pydantic import BaseModel


class Settings(BaseModel):
    app_name: str = "DSA AI Guide - AI Microservice"
    app_version: str = "1.0.0"
    debug: bool = False
    port: int = int(os.getenv("PORT", "8000"))
    host: str = os.getenv("HOST", "0.0.0.0")
    default_leakage_threshold: float = float(os.getenv("LEAKAGE_THRESHOLD", "0.80"))
    ml_models_dir: str = os.path.join(os.path.dirname(__file__), "ml", "models")


settings = Settings()
