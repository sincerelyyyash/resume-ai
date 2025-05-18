import os
import boto3
from botocore.config import Config
from fastapi import HTTPException, status, UploadFile
from typing import Union
import logging
from dotenv import load_dotenv
import uuid

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()

# R2 configuration
R2_ACCOUNT_ID = os.getenv("R2_ACCOUNT_ID")
R2_ACCESS_KEY_ID = os.getenv("R2_ACCESS_KEY_ID")
R2_SECRET_ACCESS_KEY = os.getenv("R2_SECRET_ACCESS_KEY")
R2_BUCKET_NAME = os.getenv("R2_BUCKET_NAME")
R2_PUBLIC_URL = os.getenv("R2_PUBLIC_URL")  # Your R2 public URL (e.g., https://pub-xxxxx.r2.dev)

# Configure S3 client for R2
s3_client = boto3.client(
    's3',
    endpoint_url=f'https://{R2_ACCOUNT_ID}.r2.cloudflarestorage.com',
    aws_access_key_id=R2_ACCESS_KEY_ID,
    aws_secret_access_key=R2_SECRET_ACCESS_KEY,
    config=Config(signature_version='s3v4'),
    region_name='auto'
)

def generate_unique_filename(original_filename: str) -> str:
    """Generate a unique filename to prevent collisions"""
    ext = os.path.splitext(original_filename)[1]
    return f"{uuid.uuid4()}{ext}"

async def upload_pdf(pdf: Union[str, UploadFile]) -> str:
    """
    Upload a PDF file to Cloudflare R2 and return a URL that can be used to view the PDF
    
    Parameters:
    -----------
    pdf : Union[str, UploadFile]
        Either a file path (str) or an UploadFile object
        
    Returns:
    --------
    str
        The public URL of the uploaded PDF that can be viewed in a browser
    """
    try:
        # Generate a unique filename
        if isinstance(pdf, str):
            original_filename = os.path.basename(pdf)
        else:
            original_filename = pdf.filename
        unique_filename = generate_unique_filename(original_filename)

        if isinstance(pdf, str):
            # If pdf is a file path
            logger.info(f"Uploading PDF from path: {pdf}")
            with open(pdf, 'rb') as file:
                s3_client.upload_fileobj(
                    file,
                    R2_BUCKET_NAME,
                    unique_filename,
                    ExtraArgs={
                        'ContentType': 'application/pdf',
                        'ACL': 'public-read',
                        'CacheControl': 'max-age=31536000',
                        'Metadata': {
                            'original-filename': original_filename
                        }
                    }
                )
        else:
            # If pdf is an UploadFile object
            logger.info(f"Uploading PDF from UploadFile: {pdf.filename}")
            content = await pdf.read()
            s3_client.upload_fileobj(
                content,
                R2_BUCKET_NAME,
                unique_filename,
                ExtraArgs={
                    'ContentType': 'application/pdf',
                    'ACL': 'public-read',
                    'CacheControl': 'max-age=31536000',
                    'Metadata': {
                        'original-filename': original_filename
                    }
                }
            )

        # Generate the public URL
        file_url = f"{R2_PUBLIC_URL}/{unique_filename}"
        
        logger.info(f"PDF uploaded successfully to R2. URL: {file_url}")
        return file_url
        
    except Exception as e:
        logger.error(f"Error uploading PDF to R2: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error uploading PDF to R2: {str(e)}"
        )

async def delete_pdf(file_name: str) -> bool:
    """
    Delete a PDF file from Cloudflare R2
    
    Parameters:
    -----------
    file_name : str
        The name of the file to delete
        
    Returns:
    --------
    bool
        True if deletion was successful, False otherwise
    """
    try:
        s3_client.delete_object(
            Bucket=R2_BUCKET_NAME,
            Key=file_name
        )
        logger.info(f"PDF deleted successfully from R2: {file_name}")
        return True
    except Exception as e:
        logger.error(f"Error deleting PDF from R2: {str(e)}")
        return False 