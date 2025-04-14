import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.api import endpoints


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

# Serve React build from / (root)
frontend_path = os.path.join(os.path.dirname(__file__), ".." "static")
app.mount("/", StaticFiles(directory=frontend_path, html=True), name="static")
