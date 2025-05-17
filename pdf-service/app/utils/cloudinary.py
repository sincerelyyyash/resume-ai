import cloudinary
import os 
from cloudinary.uploader import upload
from fastapi import HTTPException, status, UploadFile
from dotenv import load_dotenv
from typing import List, Union
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)

async def upload_pdf(pdf: Union[str, UploadFile]) -> str:
    """
    Upload a PDF file to Cloudinary
    
    Parameters:
    -----------
    pdf : Union[str, UploadFile]
        Either a file path (str) or an UploadFile object
        
    Returns:
    --------
    str
        The secure URL of the uploaded file
    """
    try:
        if isinstance(pdf, str):
            # If pdf is a file path
            logger.info(f"Uploading PDF from path: {pdf}")
            upload_result = upload(pdf, resource_type="raw")
        else:
            # If pdf is an UploadFile object
            logger.info(f"Uploading PDF from UploadFile: {pdf.filename}")
            # Save the file temporarily
            temp_path = f"temp_{pdf.filename}"
            try:
                with open(temp_path, "wb") as buffer:
                    content = await pdf.read()
                    buffer.write(content)
                upload_result = upload(temp_path, resource_type="raw")
            finally:
                # Clean up temporary file
                if os.path.exists(temp_path):
                    os.remove(temp_path)
        
        file_url = upload_result['secure_url']
        logger.info(f"PDF uploaded successfully. URL: {file_url}")
        return file_url
        
    except Exception as e:
        logger.error(f"Error uploading PDF: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error uploading PDF: {str(e)}"
        )