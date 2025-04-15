# **Resume-AI**  
**Tailor-made Resumes based on Job Descriptions**

**Resume-AI** is a smart resume builder that customizes resumes to align with specific job descriptions (JDs). Users can upload their professional details (projects, work experience, profiles, etc.), and with each job description, the system leverages AI to parse the requirements and adapt the user's resume content accordingly. Once completed, resumes can be downloaded or stored online for easy access.

## **Features**
- **Tailored Resumes**: Enter a job description, and Resume-AI generates a resume optimized to fit the specific requirements.
- **Professional Details Storage**: Users can add all professional details, including projects, work experiences, and roles.
- **Online Resume Storage**: All generated resumes are stored securely, accessible anytime.
- **One-Click Download**: Download updated resumes after customization for immediate use.

## **Tech Stack**
- **Frontend**: [Next.js](https://nextjs.org/), [TypeScript](https://www.typescriptlang.org/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/) for secure user authentication
- **Database**: [MongoDB](https://www.mongodb.com/) for storing user information and resume data
- **API Integration**: [Gemini API](https://gemini.com/) for parsing job descriptions and managing AI capabilities

## **Getting Started**

### **Prerequisites**
- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/)
- Gemini API Key (required for job description parsing)

### **Key Functionalities**
1. **User Authentication**: Handled through NextAuth, allowing users to securely manage their profiles and stored resumes.
2. **Job Description Parsing**: Uses the Gemini API to parse user-uploaded job descriptions and customize resume content accordingly.
3. **Data Storage**: MongoDB stores user details, resumes, and customized data for quick retrieval and updating.
4. **Resume Download**: After customization, users can download their resumes in PDF format.

## **Usage**
1. **Create an Account / Sign In**  
   Authenticate via NextAuth to create and access your profile securely.

2. **Upload Professional Details**  
   Fill in your project experiences, past roles, and other career details.

3. **Upload a Job Description**  
   Input the JD to have Resume-AI parse and generate a new, customized resume.

4. **Download Your Customized Resume**  
   Once generated, the resume can be downloaded in PDF format or saved for future use.

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

With **Resume-AI**, ensure your resume always aligns perfectly with the role youÕre targeting, all while saving time and effort!
