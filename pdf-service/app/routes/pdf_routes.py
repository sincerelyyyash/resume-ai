from fastapi import APIRouter, HTTPException
from app.utils.pdf_generator import generate_resume_pdf
from app.schema.pdf_schema import ResumeRequest
from app.utils.cloudinary import upload_pdf
import os   

router = APIRouter(prefix="/pdf", tags=["PDF Generator"])



@router.post("/generate")
async def generate_resume(request: ResumeRequest):
    try:
        # Convert Pydantic models to dictionaries
        education_entries = [entry.dict() for entry in request.education_entries]
        experience_entries = [entry.dict() for entry in request.experience_entries]
        project_entries = [entry.dict() for entry in request.project_entries]
        
        # Generate the PDF
        pdf_path = generate_resume_pdf(
            full_name=request.full_name,
            phone_number=request.phone_number,
            email=request.email,
            linkedin_url=request.linkedin_url,
            github_url=request.github_url,
            education_entries=education_entries,
            experience_entries=experience_entries,
            project_entries=project_entries,
            languages=request.languages,
            frameworks=request.frameworks,
            developer_tools=request.developer_tools,
            libraries=request.libraries,
            output_filename=request.output_filename
        )
        # Upload the PDF to Cloudinary
        pdf_url = await upload_pdf(pdf_path)
        # Delete the local PDF file
        os.remove(pdf_path)
        # Return the path to the generated PDF
        return {"status": "success", "pdf_url": pdf_url}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 