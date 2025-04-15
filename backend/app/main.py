import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.api import endpoints
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# CORS middleware to allow frontend to talk to the backend

ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Include the endpoints
app.include_router(endpoints.router)

# Serve React build from / (root) -- NOTE: required for production only
if os.getenv("ENVIRONMENT") == "production":
    frontend_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "static"))
    app.mount("/", StaticFiles(directory=frontend_path, html=True), name="static")

#TEMP: Looking for cause of Runtime Error.
# List routes on startup
for route in app.routes:
    print(f"🔗 ROUTE: {route.path} → {route.name}")
