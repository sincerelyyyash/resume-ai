from fastapi import APIRouter, HTTPException
from app.utils.pdf_generator import generate_resume_pdf
from app.schema.pdf_schema import ResumeRequest
from app.utils.r2_storage import upload_pdf, delete_pdf
import os
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/pdf", tags=["PDF Generator"])

@router.post("/generate")
async def generate_resume(request: ResumeRequest):
    try:
        logger.info("Received resume generation request")
        
        # Convert Pydantic models to dictionaries, handling None values
        education_entries = [entry.dict() for entry in request.education_entries] if request.education_entries else []
        experience_entries = [entry.dict() for entry in request.experience_entries] if request.experience_entries else []
        project_entries = [entry.dict() for entry in request.project_entries] if request.project_entries else []
        skill_categories = [category.dict() for category in request.skill_categories] if request.skill_categories else []
        
        logger.info("Generating PDF with data")
        # Generate the PDF
        pdf_path = generate_resume_pdf(
            full_name=request.full_name,
            phone_number=request.phone_number,
            email=request.email,
            linkedin_url=request.linkedin_url,
            github_url=request.github_url,
            website_url=request.website_url,
            education_entries=education_entries,
            experience_entries=experience_entries,
            project_entries=project_entries,
            skill_categories=skill_categories,
            output_filename=request.output_filename
        )
        
        logger.info("PDF generated successfully, uploading to R2")
        # Upload the PDF to R2
        pdf_url = await upload_pdf(pdf_path)
        
        logger.info("Cleaning up local PDF file")
        # Delete the local PDF file
        if os.path.exists(pdf_path):
            os.remove(pdf_path)
        
        logger.info("Resume generation completed successfully")
        # Return the path to the generated PDF
        return {"status": "success", "pdf_url": pdf_url}
        
    except Exception as e:
        logger.error(f"Error generating resume: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail=f"Failed to generate PDF: {str(e)}"
        ) 