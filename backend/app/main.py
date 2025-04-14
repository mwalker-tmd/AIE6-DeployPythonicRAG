import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.api import endpoints

#TEMP: Looking for cause of Runtime Error.
print("✅ FastAPI is booting...")
print("PYTHONPATH:", os.getenv("PYTHONPATH"))

#Check for the frontend files, which should be in the /static path, logging results
frontend_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "static"))
print("✅ Looking for static frontend at:", frontend_path)

if not os.path.exists(frontend_path):
    print("❌ Static directory does not exist!")
else:
    print("✅ Static directory found. Contents:")
    print(os.listdir(frontend_path))


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
frontend_path = os.path.join(os.path.dirname(__file__), "static")
app.mount("/", StaticFiles(directory=frontend_path, html=True), name="static")
