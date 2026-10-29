from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.config import Settings
from .api.routes import health, property_routes, ai_routes

settings = Settings()

app = FastAPI(title="LandLens API", version="0.1.0")

# CORS configuration – allow dev origins and local private LAN IP addresses (192.168.x.x, 10.x.x.x, 172.16-31.x.x)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_origin_regex=r"^https?://(localhost|127\.0\.0\.1|10\.\d{1,3}\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3})(:\d+)?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(health.router, prefix="/api")
app.include_router(property_routes.router, prefix="/api")
app.include_router(ai_routes.router, prefix="/api")

@app.get("/health", tags=["Health"])
@app.get("/api/health", include_in_schema=False)
async def health_check():
    return {"status": "ok", "service": "landlens-api"}
