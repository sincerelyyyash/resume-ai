from pydantic import BaseModel
from typing import List, Optional

class EducationEntry(BaseModel):
    institution: str
    location: str
    degree: str
    date_range: str

class ExperienceEntry(BaseModel):
    title: str
    dates: str
    organization: str
    location: str
    responsibilities: List[str]

class ProjectEntry(BaseModel):
    name: str
    technologies: str
    date_range: Optional[str] = None
    details: List[str]

class ResumeRequest(BaseModel):
    # Personal Information
    full_name: str
    phone_number: Optional[str] = None
    email: str
    linkedin_url: str
    github_url: str
    
    # Education
    education_entries: List[EducationEntry]
    
    # Experience
    experience_entries: List[ExperienceEntry]
    
    # Projects
    project_entries: List[ProjectEntry]
    
    # Technical Skills
    languages: List[str]
    frameworks: List[str]
    developer_tools: List[str]
    libraries: List[str]
    
    output_filename: Optional[str] = "resume.pdf"
