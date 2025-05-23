from pydantic import BaseModel
from typing import List, Optional

class EducationEntry(BaseModel):
    institution: str
    degree: str
    date_range: str
    location: Optional[str] = None

class ExperienceEntry(BaseModel):
    title: str
    dates: str
    organization: str
    responsibilities: List[str]
    location: Optional[str] = None

class ProjectEntry(BaseModel):
    name: str
    technologies: str
    details: List[str]
    date_range: Optional[str] = None

class ResumeRequest(BaseModel):
    # Personal Information
    full_name: str
    email: str
    phone_number: Optional[str] = None
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    
    # Education
    education_entries: Optional[List[EducationEntry]] = None
    
    # Experience
    experience_entries: Optional[List[ExperienceEntry]] = None
    
    # Projects
    project_entries: Optional[List[ProjectEntry]] = None
    
    # Technical Skills
    languages: Optional[List[str]] = None
    frameworks: Optional[List[str]] = None
    developer_tools: Optional[List[str]] = None
    libraries: Optional[List[str]] = None
    
    output_filename: Optional[str] = "resume.pdf"
