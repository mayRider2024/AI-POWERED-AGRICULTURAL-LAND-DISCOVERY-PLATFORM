from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import field_validator
from typing import Union, List
import json

class Settings(BaseSettings):
    """Application settings loaded from environment variables or a .env file."""

    # Database URL – required. Example: postgresql+psycopg://user:pass@host:5432/dbname
    DATABASE_URL: str = "postgresql+psycopg://postgres:postgres@localhost:5432/landlens"

    # CORS origins – allow local React dev server and Capacitor by default
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost",
        "https://localhost",
        "capacitor://localhost",
        "http://localhost:8001",
    ]

    # Gemini AI configuration
    GEMINI_API_KEY: str | None = None
    GEMINI_MODEL: str = "gemini-2.5-flash"

    # Rate limiting configuration (per client IP)
    RATE_LIMIT_AI_PER_MINUTE: int = 5
    RATE_LIMIT_AI_ENABLED: bool = True

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    @field_validator("DATABASE_URL", mode="before")
    @classmethod
    def normalize_database_url(cls, v: str) -> str:
        if not v:
            return v
        url = v.strip()
        # Supabase/Heroku often provide `postgres://` or `postgresql://`
        # SQLAlchemy 2.0 with psycopg v3 prefers `postgresql+psycopg://`
        if url.startswith("postgres://"):
            url = url.replace("postgres://", "postgresql+psycopg://", 1)
        elif url.startswith("postgresql://") and not url.startswith("postgresql+"):
            url = url.replace("postgresql://", "postgresql+psycopg://", 1)
        return url

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def parse_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, list):
            return v
        if isinstance(v, str):
            v = v.strip()
            if v.startswith("[") and v.endswith("]"):
                try:
                    return json.loads(v)
                except Exception:
                    pass
            # Comma-separated list fallback
            return [origin.strip() for origin in v.split(",") if origin.strip()]
        return []
