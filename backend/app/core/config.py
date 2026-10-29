from pydantic_settings import BaseSettings
from pathlib import Path

class Settings(BaseSettings):
    """Application settings loaded from environment variables or a .env file."""

    # Database URL – required. Example: postgresql+psycopg://user:pass@localhost:5432/landlens
    DATABASE_URL: str = "postgresql+psycopg://postgres:postgres@localhost:5432/landlens"

    # CORS origins – allow local React dev server and Capacitor by default
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost",
        "https://localhost",
        "capacitor://localhost",
        "http://localhost:8001",
    ]

    # Gemini AI configuration
    GEMINI_API_KEY: str | None = None
    GEMINI_MODEL: str = "gemini-1.5-flash"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
