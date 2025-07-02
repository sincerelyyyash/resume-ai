import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { resumeDataSchema, type ResumeData } from "@/types/resume-upload.schema";
import { apiSecurity } from "@/middleware/api-security";
import { prisma } from "@/lib/prisma";
import { ZodError } from "zod";

type SanitizedUserData = {
  name?: string;
  bio?: string;
  portfolio?: string;
  linkedin?: string;
  github?: string;
};

type SanitizedProjectData = {
  title: string;
  description: string;
  startDate: string;
  endDate?: string;
  url?: string;
  technologies: string[];
};

type SanitizedExperienceData = {
  title: string;
  company: string;
  description: string;
  startDate: string;
  endDate?: string;
  current: boolean;
  location?: string;
};

type SanitizedEducationData = {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
  current: boolean;
};

type SanitizedSkillData = {
  name: string;
  category: string;
  level: "Beginner" | "Intermediate" | "Expert";
  yearsOfExperience: number;
};

type SanitizedCertificationData = {
  title: string;
  issuer: string;
  description?: string;
  issueDate: string;
  expiryDate?: string;
  credentialUrl?: string;
};

type SanitizedResumeData = {
  user?: SanitizedUserData;
  projects?: SanitizedProjectData[];
  experiences?: SanitizedExperienceData[];
  education?: SanitizedEducationData[];
  skills?: SanitizedSkillData[];
  certifications?: SanitizedCertificationData[];
};

// Helper function to sanitize URL
const sanitizeUrl = (url: string | undefined | null): string => {
  if (!url || typeof url !== 'string') return "";
  const trimmed = url.trim();
  if (!trimmed) return "";
  
  // Check if it's a valid URL
  try {
    new URL(trimmed);
    return trimmed;
  } catch {
    // If it's not a valid URL, try adding https://
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
      try {
        new URL(`https://${trimmed}`);
        return `https://${trimmed}`;
      } catch {
        return "";
      }
    }
    return "";
  }
};

// Helper function to sanitize and transform data
const sanitizeResumeData = (data: unknown): SanitizedResumeData => {
  const sanitized = { ...(data as Record<string, unknown>) };
  const result: SanitizedResumeData = {};

  // Sanitize user data
  if (sanitized.user && typeof sanitized.user === 'object' && sanitized.user !== null) {
    const userData = sanitized.user as Record<string, unknown>;
    result.user = {
      name: typeof userData.name === 'string' ? userData.name.trim() || undefined : undefined,
      bio: typeof userData.bio === 'string' ? userData.bio.trim() || undefined : undefined,
      portfolio: sanitizeUrl(typeof userData.portfolio === 'string' ? userData.portfolio : undefined),
      linkedin: sanitizeUrl(typeof userData.linkedin === 'string' ? userData.linkedin : undefined),
      github: sanitizeUrl(typeof userData.github === 'string' ? userData.github : undefined),
    };
  }

  // Sanitize projects
  if (sanitized.projects && Array.isArray(sanitized.projects)) {
    result.projects = sanitized.projects
      .filter((project: unknown) => {
        const proj = project as Record<string, unknown>;
        return typeof proj.title === 'string' && proj.title?.trim() && 
               typeof proj.description === 'string' && proj.description?.trim();
      })
      .map((project: unknown) => {
        const proj = project as Record<string, unknown>;
        return {
          title: (proj.title as string).trim(),
          description: (proj.description as string).trim(),
          startDate: proj.startDate as string,
          endDate: proj.endDate ? proj.endDate as string : undefined,
          url: sanitizeUrl(typeof proj.url === 'string' ? proj.url : undefined),
          technologies: Array.isArray(proj.technologies) ? 
            proj.technologies.filter((t: unknown) => typeof t === 'string' && t?.trim()) as string[] : [],
        };
      });
  }

  // Sanitize experiences
  if (sanitized.experiences && Array.isArray(sanitized.experiences)) {
    result.experiences = sanitized.experiences
      .filter((exp: unknown) => {
        const experience = exp as Record<string, unknown>;
        return typeof experience.title === 'string' && experience.title?.trim() && 
               typeof experience.company === 'string' && experience.company?.trim() && 
               typeof experience.description === 'string' && experience.description?.trim();
      })
      .map((exp: unknown) => {
        const experience = exp as Record<string, unknown>;
        return {
          title: (experience.title as string).trim(),
          company: (experience.company as string).trim(),
          description: (experience.description as string).trim(),
          startDate: experience.startDate as string,
          endDate: experience.endDate ? experience.endDate as string : undefined,
          current: Boolean(experience.current),
          location: typeof experience.location === 'string' ? experience.location.trim() || undefined : undefined,
        };
      });
  }

  // Sanitize education
  if (sanitized.education && Array.isArray(sanitized.education)) {
    console.log('Raw education data before sanitization:', sanitized.education);
    
    result.education = sanitized.education
      .filter((edu: unknown) => {
        // Only require institution and degree, field can be optional
        const education = edu as Record<string, unknown>;
        const hasRequiredFields = typeof education.institution === 'string' && education.institution?.trim() && 
                                 typeof education.degree === 'string' && education.degree?.trim();
        if (!hasRequiredFields) {
          console.log('Education entry filtered out due to missing required fields:', {
            institution: education.institution,
            degree: education.degree,
            field: education.field
          });
        }
        return hasRequiredFields;
      })
      .map((edu: unknown) => {
        const education = edu as Record<string, unknown>;
        return {
          institution: (education.institution as string).trim(),
          degree: (education.degree as string).trim(),
          field: typeof education.field === 'string' ? education.field.trim() || (education.degree as string).trim() : (education.degree as string).trim(),
          startDate: education.startDate as string,
          endDate: education.endDate ? education.endDate as string : undefined,
          current: Boolean(education.current),
        };
      });
    
    console.log('Education data after sanitization:', result.education);
  }

  // Sanitize skills (AI will handle categorization during parsing)
  if (sanitized.skills && Array.isArray(sanitized.skills)) {
    result.skills = sanitized.skills
      .filter((skill: unknown) => {
        const skillData = skill as Record<string, unknown>;
        return typeof skillData.name === 'string' && skillData.name?.trim() && 
               typeof skillData.category === 'string' && skillData.category?.trim();
      })
      .map((skill: unknown) => {
        const skillData = skill as Record<string, unknown>;
        const level = typeof skillData.level === 'string' && 
                     ["Beginner", "Intermediate", "Expert"].includes(skillData.level) ? 
                     skillData.level as "Beginner" | "Intermediate" | "Expert" : "Intermediate";
        return {
          name: (skillData.name as string).trim(),
          category: (skillData.category as string).trim(),
          level,
          yearsOfExperience: typeof skillData.yearsOfExperience === 'number' ? skillData.yearsOfExperience : 0,
        };
      });
  }

  // Sanitize certifications
  if (sanitized.certifications && Array.isArray(sanitized.certifications)) {
    result.certifications = sanitized.certifications
      .filter((cert: unknown) => {
        const certification = cert as Record<string, unknown>;
        return typeof certification.title === 'string' && certification.title?.trim() && 
               typeof certification.issuer === 'string' && certification.issuer?.trim();
      })
      .map((cert: unknown) => {
        const certification = cert as Record<string, unknown>;
        return {
          title: (certification.title as string).trim(),
          issuer: (certification.issuer as string).trim(),
          description: typeof certification.description === 'string' ? certification.description.trim() || undefined : undefined,
          issueDate: certification.issueDate as string,
          expiryDate: certification.expiryDate ? certification.expiryDate as string : undefined,
          credentialUrl: sanitizeUrl(typeof certification.credentialUrl === 'string' ? certification.credentialUrl : undefined),
        };
      });
  }

  return result;
};

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  let userId: string | undefined;

  try {
    // Apply security measures (but skip validation here since we'll do custom validation)
    const securityResponse = await apiSecurity(req);
    if (securityResponse) return securityResponse;

    // Authentication check
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({
        success: false,
        error: "Authentication required",
        message: "You must be logged in to save resume data"
      }, { status: 401 });
    }

    userId = session.user.id;

    // Parse and validate request body with custom sanitization
    let body;
    try {
      const rawBody = await req.json();
      console.log('Raw body received:', JSON.stringify(rawBody, null, 2));
      
      // Sanitize the data before validation
      const sanitizedData = sanitizeResumeData(rawBody);
      console.log('Sanitized data:', JSON.stringify(sanitizedData, null, 2));
      
      // Validate with the schema
      body = resumeDataSchema.parse(sanitizedData);
      console.log('Validation successful');
      
    } catch (error) {
      console.error('Validation error:', error);
      if (error instanceof ZodError) {
        console.error('Validation details:', error.errors);
        return NextResponse.json({
          success: false,
          error: "Invalid data format",
          message: "The resume data format is invalid",
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
            value: err.code === 'invalid_type' && 'input' in err ? `Received: ${typeof err.input}` : undefined
          }))
        }, { status: 400 });
      }
      return NextResponse.json({
        success: false,
        error: "Invalid request body",
        message: "Failed to parse request data"
      }, { status: 400 });
    }

    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({
        success: false,
        error: "User not found",
        message: "The authenticated user could not be found"
      }, { status: 404 });
    }

    // Process data in a single transaction for data consistency
    const result = await prisma.$transaction(async (tx) => {
      const counters = {
        userUpdates: 0,
        projects: 0,
        experiences: 0,
        education: 0,
        skills: 0,
        certifications: 0
      };

      // Update user basic info if provided
      if (body.user && Object.keys(body.user).length > 0) {
        const updateData: {
          name?: string;
          bio?: string;
          portfolio?: string;
          linkedin?: string;
          github?: string;
        } = {};

         if (body.user.name?.trim()) updateData.name = body.user.name.trim();
          if (body.user.bio !== undefined) updateData.bio = body.user.bio?.trim() || "";
          if (body.user.portfolio !== undefined) updateData.portfolio = body.user.portfolio?.trim() || "";
          if (body.user.linkedin !== undefined) updateData.linkedin = body.user.linkedin?.trim() || "";
          if (body.user.github !== undefined) updateData.github = body.user.github?.trim() || "";

        if (Object.keys(updateData).length > 0) {
          await tx.user.update({
            where: { id: userId },
            data: updateData,
          });
          counters.userUpdates = 1;
        }
      }

      // Clear existing data to replace with new parsed data
      await Promise.all([
        tx.project.deleteMany({ where: { userId } }),
        tx.experience.deleteMany({ where: { userId } }),
        tx.education.deleteMany({ where: { userId } }),
        tx.skill.deleteMany({ where: { userId } }),
        tx.certification.deleteMany({ where: { userId } })
      ]);

      // Create projects
      if (body.projects && Array.isArray(body.projects) && body.projects.length > 0) {
        const projectsData = body.projects.map((project: ResumeData['projects'][0]) => ({
          title: project.title.trim(),
          description: project.description.trim(),
          startDate: new Date(project.startDate),
          endDate: project.endDate ? new Date(project.endDate) : null,
          url: project.url?.trim() || null,
          technologies: project.technologies || [],
          userId: userId!,
        }));

        await tx.project.createMany({
          data: projectsData,
          skipDuplicates: false,
        });
        counters.projects = projectsData.length;
      }

      // Create experiences
      if (body.experiences && Array.isArray(body.experiences) && body.experiences.length > 0) {
        const experiencesData = body.experiences.map((experience: ResumeData['experiences'][0]) => ({
          title: experience.title.trim(),
          company: experience.company.trim(),
          description: experience.description.trim(),
          startDate: new Date(experience.startDate),
          endDate: experience.endDate ? new Date(experience.endDate) : null,
          current: experience.current || false,
          location: experience.location?.trim() || null,
          userId: userId!,
        }));

        await tx.experience.createMany({
          data: experiencesData,
          skipDuplicates: false,
        });
        counters.experiences = experiencesData.length;
      }

      // Create education
      if (body.education && Array.isArray(body.education) && body.education.length > 0) {
        console.log('Creating education entries:', body.education);
        
        const educationData = body.education.map((education: ResumeData['education'][0]) => ({
          institution: education.institution.trim(),
          degree: education.degree.trim(),
          field: education.field.trim(),
          startDate: new Date(education.startDate),
          endDate: education.endDate ? new Date(education.endDate) : null,
          current: education.current || false,
          userId: userId!,
        }));

        console.log('Education data prepared for database:', educationData);

        await tx.education.createMany({
          data: educationData,
          skipDuplicates: false,
        });
        counters.education = educationData.length;
        console.log(`Successfully created ${educationData.length} education entries`);
      } else {
        console.log('No education data to create:', {
          hasEducation: !!body.education,
          isArray: Array.isArray(body.education),
          length: body.education?.length || 0
        });
      }

      // Create skills (already categorized by AI)
      if (body.skills && Array.isArray(body.skills) && body.skills.length > 0) {
        const skillsData = body.skills.map((skill: ResumeData['skills'][0]) => ({
          name: skill.name.trim(),
          category: skill.category.trim(),
          level: skill.level || "Intermediate",
          yearsOfExperience: skill.yearsOfExperience || 0,
          userId: userId!,
        }));

        await tx.skill.createMany({
          data: skillsData,
          skipDuplicates: false,
        });
        counters.skills = skillsData.length;
      }

      // Create certifications
      if (body.certifications && Array.isArray(body.certifications) && body.certifications.length > 0) {
        const certificationsData = body.certifications.map((certification: ResumeData['certifications'][0]) => ({
          title: certification.title.trim(),
          issuer: certification.issuer.trim(),
          description: certification.description?.trim() || null,
          issueDate: new Date(certification.issueDate),
          expiryDate: certification.expiryDate ? new Date(certification.expiryDate) : null,
          credentialUrl: certification.credentialUrl?.trim() || null,
          userId: userId!,
        }));

        await tx.certification.createMany({
          data: certificationsData,
          skipDuplicates: false,
        });
        counters.certifications = certificationsData.length;
      }

      return counters;
    });

    // Log successful operation
    const processingTime = Date.now() - startTime;
    console.log(`Resume data saved successfully for user ${userId}:`, {
      ...result,
      processingTime: `${processingTime}ms`,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({
      success: true,
      message: "Resume data saved successfully",
      data: {
        saved: result,
        summary: `Updated profile with ${result.projects} projects, ${result.experiences} experiences, ${result.education} education entries, ${result.skills} skills, and ${result.certifications} certifications.`
      }
    }, { status: 200 });

  } catch (error) {
    // Log errors with context
    const processingTime = Date.now() - startTime;
    console.error(`Failed to save resume data for user ${userId || 'unknown'}:`, {
      error: error instanceof Error ? {
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      } : String(error),
      processingTime: `${processingTime}ms`,
      timestamp: new Date().toISOString(),
      userId: userId || 'unknown'
    });

    return NextResponse.json({
      success: false,
      error: "Failed to save resume data",
      message: "An error occurred while saving your resume data. Please try again."
    }, { status: 500 });
  }
}

// Handle preflight OPTIONS request for CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
} 