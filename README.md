# **Resume-AI**  

**Resume-AI** is a smart resume builder that customizes resumes to align with specific job descriptions (JDs). Users can upload their professional details (projects, work experience, profiles, etc.), and with each job description, the system leverages AI to parse the requirements and adapt the user's resume content accordingly. Once completed, resumes can be downloaded or stored online for easy access.

## **Features**
- **Tailored Resumes**: Enter a job description, and Resume-AI generates a resume optimized to fit the specific requirements.
- **Professional Details Storage**: Users can add all professional details, including projects, work experiences, and roles.
- **Online Resume Storage**: All generated resumes are stored securely in Cloudflare R2, accessible anytime.
- **One-Click Download**: Download updated resumes after customization for immediate use.
- **Job Description Management**: Save and manage multiple job descriptions with their corresponding resumes.
- **AI-Powered Analysis**: Get detailed analysis of your resume's match with job requirements.
- **ATS-Optimized Resumes**: Ensure your resumes are formatted to easily pass through Applicant Tracking Systems.
- **Smart Resume Insights**: Receive actionable AI suggestions to refine and strengthen your resume.
- **Saved Job Descriptions**: View and manage all your saved job descriptions in one place with easy access to their corresponding resumes.
- **Resume History**: Track and access all versions of your resumes generated for different job applications.
- **Comprehensive Profile Management**: 
  - Projects with technologies and achievements
  - Work experience with detailed descriptions
  - Education history with degrees and fields
  - Skills categorized by type and proficiency
  - Certifications with issue dates and credentials
- **Real-time Form Validation**: Immediate feedback on required fields and data format.
- **Secure Authentication**: 
  - Protected routes and API endpoints with NextAuth.js
  - Client and server-side authentication hooks
  - Session management with secure cookies
  - Role-based access control
  - Automatic redirect for unauthenticated users

## **Tech Stack**
### **Frontend**
- **Framework**: Next.js 14 with App Router
- **UI Components**: 
  - TailwindCSS for styling
  - Shadcn/ui for component library
  - Aceternity UI for animations
- **State Management**: React Context + Hooks
- **Authentication**: 
  - NextAuth.js with secure session handling
  - Custom authentication hooks for client components
  - Server-side authentication utilities
  - Protected API routes with middleware

### **Backend Services**
- **PDF Generation Service**: FastAPI-based microservice
  - LaTeX-based PDF generation
  - Cloudflare R2 for PDF storage
- **AI Service**: FastAPI-based microservice
  - Gemini API integration for job analysis
  - Custom prompt engineering for better results

### **Database**
- **Primary**: PostgreSQL with Prisma ORM
- **Storage**: Cloudflare R2 for PDF storage

## **Project Structure**
```
resume-ai/
├── nextjs-app/                 # Frontend application
│   ├── src/
│   │   ├── app/               # Next.js app router pages
│   │   ├── components/        # React components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── lib/              # Utility functions
│   │   └── types/            # TypeScript types
│   └── prisma/               # Database schema and migrations
│
├── pdf-service/              # PDF generation microservice
    ├── app/
    │   ├── routes/          # API endpoints
    │   ├── utils/           # Utility functions
    │   └── main.py          # FastAPI application
    └── generated_pdfs/      # Temporary PDF storage
```

## **Getting Started**

### **Prerequisites**
- Node.js 18+
- Python 3.9+
- PostgreSQL 14+
- Cloudflare R2 Account
- Gemini API Key

### **Installation**

1. **Frontend Setup**
```bash
cd nextjs-app
npm install
npx prisma generate
npx prisma db push
npm run dev
```

2. **PDF Service Setup**
```bash
cd pdf-service
python -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## **Key Functionalities**

### **1. User Authentication**
- Secure authentication using NextAuth.js
- Protected routes and API endpoints
- Session management and user profiles
- Profile completion tracking
- Client-side authentication hooks
- Server-side authentication utilities
- Automatic redirect for unauthenticated users
- Role-based access control

### **2. Resume Generation**
- LaTeX-based PDF generation
- Professional formatting and styling
- Support for multiple sections:
  - Personal Information
  - Education
  - Experience
  - Projects
  - Technical Skills
  - Certifications
- ATS-friendly formatting
- Customizable templates

### **3. Job Description Analysis**
- AI-powered job requirement parsing
- Resume matching and scoring
- Detailed analysis of skills and experience alignment
- Smart suggestions for improvement
- Keyword optimization

### **4. PDF Storage and Management**
- Secure storage in Cloudflare R2
- Public URL generation for easy access
- Automatic cleanup of temporary files
- Version control for different job applications

### **5. Job Description Management**
- Save and organize multiple job descriptions
- Track resume versions for each job
- Quick access to previous applications
- Job application status tracking
- View all saved job descriptions in a centralized dashboard
- Compare different versions of resumes for the same job
- Easy navigation between job descriptions and their corresponding resumes
- Filter and search through saved job descriptions

### **6. Profile Management**
- Multi-step profile creation wizard
- Real-time form validation
- Bulk data import/export
- Resume upload and processing
- Comprehensive section management:
  - Projects with technologies
  - Work experience with locations
  - Education with fields of study
  - Skills with proficiency levels
  - Certifications with credentials

## **Contributing**
Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create a new branch (`feature/your-feature`)
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## **License**
This project is licensed under the MIT License. See the `LICENSE` file for more information.

---

With **Resume-AI**, ensure your resume always aligns perfectly with the role you're targeting, all while saving time and effort!
