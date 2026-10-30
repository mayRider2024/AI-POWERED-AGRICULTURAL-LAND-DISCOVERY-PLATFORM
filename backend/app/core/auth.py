from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
from jwt import PyJWKClient
import os

security = HTTPBearer(auto_error=False)

# Supabase Project Configuration
SUPABASE_URL = os.getenv("SUPABASE_URL", "https://xcoufxenbsafjcmsyyds.supabase.co")
SUPABASE_JWT_AUD = os.getenv("SUPABASE_JWT_AUD", "authenticated")
JWKS_URL = f"{SUPABASE_URL.rstrip('/')}/auth/v1/.well-known/jwks.json"

jwks_client = PyJWKClient(JWKS_URL)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    """
    Validates the Supabase-issued RS256/ES256/HS256 JWT bearer token from the Authorization header.
    Extracts the verified subject ('sub' = Supabase user UUID) and claims.
    Never trusts an unverified user ID passed in client payloads.
    """
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing Authorization header",
            headers={"WWW-Authenticate": "Bearer"},
        )

    token = credentials.credentials

    try:
        signing_key = jwks_client.get_signing_key_from_jwt(token)
        payload = jwt.decode(
            token,
            signing_key.key,
            algorithms=["RS256", "ES256"],
            audience=SUPABASE_JWT_AUD,
        )
        return {
            "id": payload.get("sub"),
            "email": payload.get("email"),
            "role": payload.get("role"),
            "claims": payload,
        }
    except Exception as e:
        # Fallback check: If HS256 secret is configured
        jwt_secret = os.getenv("SUPABASE_JWT_SECRET")
        if jwt_secret:
            try:
                payload = jwt.decode(
                    token,
                    jwt_secret,
                    algorithms=["HS256"],
                    audience=SUPABASE_JWT_AUD,
                )
                return {
                    "id": payload.get("sub"),
                    "email": payload.get("email"),
                    "role": payload.get("role"),
                    "claims": payload,
                }
            except Exception:
                pass

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid or expired Supabase authentication token: {str(e)}",
            headers={"WWW-Authenticate": "Bearer"},
        )

async def get_optional_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict | None:
    """
    Validates Supabase JWT bearer token if present.
    Returns authenticated user dict or None if unauthenticated / guest request.
    """
    if not credentials:
        return None
    try:
        return await get_current_user(credentials)
    except HTTPException:
        return None
