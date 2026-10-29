# Backend for LandLens AI

This directory contains the FastAPI backend, database models, migrations, and tests.

## Structure
```
backend/
  app/
    main.py                # FastAPI entry point
    core/
      config.py            # Pydantic Settings
    db/
      base.py              # Declarative base
      session.py           # Engine and session maker
    models/
      __init__.py
      district.py
      taluka.py
      village.py
      property.py
      data_source.py
    schemas/
      __init__.py
      property.py
    api/
      __init__.py
      routes/
        __init__.py
        health.py
    services/
      __init__.py
  alembic/
    env.py                 # Alembic environment configuration
    README
    script.py
    versions/
      <timestamp>_init.py   # Initial migration
  tests/
    __init__.py
    conftest.py           # fixtures for testing
    test_health.py        # health endpoint test
    test_models.py        # model validation tests
  requirements.txt
  .env.example
  README.md
  seed.py                 # Seed demo data into the database
```

## How to run
```bash
# Install dependencies
python -m venv venv
source venv/bin/activate
pip install -r backend/requirements.txt

# Set up environment variables (copy .env.example first)
cp backend/.env.example .env
# Edit .env to point to your PostgreSQL instance with PostGIS enabled

# Run Alembic migrations
alembic -c backend/alembic.ini upgrade head

# Start the API for local Mac browser only:
uvicorn app.main:app --host 127.0.0.1 --port 8001 --reload

# Or start the API bound to 0.0.0.0 for trusted local network (physical Android phone testing):
uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload
```

The API will be available locally at `http://127.0.0.1:8001` and across your trusted Wi-Fi/LAN at `http://<your-mac-lan-ip>:8001` (e.g. `http://192.168.x.x:8001`). Swagger UI is at `/docs`.
> **Security Note:** Do not bind `0.0.0.0` on untrusted or public networks without a firewall or authentication proxy. CORS middleware permits requests from private local subnets (192.168.x.x, 10.x.x.x, 172.16-31.x.x) and localhost.
