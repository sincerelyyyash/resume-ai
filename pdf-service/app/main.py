from fastapi import FastAPI
from app.routes.pdf_routes import router as pdf_router


app = FastAPI(title="Resume-AI PDF Service")

app.include_router(pdf_router, prefix="/api/v1",)


