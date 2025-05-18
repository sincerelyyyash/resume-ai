from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.routes.pdf_routes import router as pdf_router
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get allowed origin from environment variable
MAIN_SERVICE_ORIGIN = os.getenv("MAIN_SERVICE_ORIGIN_URL")
if not MAIN_SERVICE_ORIGIN:
    raise ValueError("MAIN_SERVICE_ORIGIN_URL environment variable is not set")

app = FastAPI(title="Resume-AI PDF Service")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[MAIN_SERVICE_ORIGIN],
    allow_credentials=True,
    allow_methods=["POST", "GET", "OPTIONS"],
    allow_headers=["*"],
    max_age=3600, 
)

# Add security headers middleware
@app.middleware("http")
async def add_security_headers(request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    return response

app.include_router(pdf_router, prefix="/api/v1")


