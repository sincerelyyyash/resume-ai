import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import { prisma } from '@/lib/prisma';
import type { NextRequest } from 'next/server';

// Define interfaces for the data structures
interface EducationEntry {
  institution: string;
  location: string;
  degree: string;
  date_range: string;
}

interface ExperienceEntry {
  title: string;
  organization: string;
  location: string;
  dates: string;
  responsibilities: string[];
}

interface ProjectEntry {
  name: string;
  technologies: string;
  date_range?: string;
  details: string[];
}

interface SkillCategory {
  category_name: string;
  skills: string[];
}

interface UserData {
  full_name: string;
  phone_number?: string;
  email: string;
  linkedin_url?: string;
  github_url?: string;
  website_url?: string;
  education_entries: EducationEntry[];
  experience_entries: ExperienceEntry[];
  project_entries: ProjectEntry[];
  skill_categories: SkillCategory[];
}

interface RequestBody {
  jobDescription: string;
  userData: UserData;
}

export async function POST(req: NextRequest) {
  try {
    // Parse and validate request body
    const body = await req.json() as RequestBody;
    console.log('Received request body:', JSON.stringify(body, null, 2));

    const { jobDescription, userData } = body;

    // Get authenticated user
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Format the data for the PDF service
    const formattedData = {
      full_name: userData.full_name || '',
      phone_number: userData.phone_number || null,
      email: userData.email || '',
      linkedin_url: userData.linkedin_url || '',
      github_url: userData.github_url || '',
      website_url: userData.website_url || '',
      education_entries: userData.education_entries.map((edu: EducationEntry) => ({
        institution: edu.institution || '',
        location: edu.location || '',
        degree: edu.degree || '',
        date_range: edu.date_range || ''
      })),
      experience_entries: userData.experience_entries.map((exp: ExperienceEntry) => ({
        title: exp.title || '',
        organization: exp.organization || '',
        location: exp.location || '',
        dates: exp.dates || '',
        responsibilities: exp.responsibilities || []
      })),
      project_entries: userData.project_entries.map((proj: ProjectEntry) => ({
        name: proj.name || '',
        technologies: proj.technologies || '',
        date_range: proj.date_range,
        details: proj.details || []
      })),
      skill_categories: userData.skill_categories || [],
      output_filename: `${(userData.full_name || 'resume').toLowerCase().replace(/\s+/g, '-')}-resume.pdf`
    };

    // Validate required fields
    if (!formattedData.full_name || !formattedData.email) {
      console.error('Missing required fields:', {
        full_name: formattedData.full_name,
        email: formattedData.email,
        original_data: userData
      });
      throw new Error('Name and email are required fields');
    }

    // Ensure PDF_SERVICE_API is set
    if (!process.env.PDF_SERVICE_API) {
      throw new Error('PDF_SERVICE_API environment variable is not set');
    }

    // Call PDF generation service
    const pdfServiceUrl = `${process.env.PDF_SERVICE_API}/pdf/generate`;
    console.log('Calling PDF service at:', pdfServiceUrl);

    const pdfResponse = await fetch(pdfServiceUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formattedData),
    });

    if (!pdfResponse.ok) {
      const errorData = await pdfResponse.json().catch(() => ({ detail: 'Unknown error' }));
      console.error('PDF generation failed:', {
        status: pdfResponse.status,
        statusText: pdfResponse.statusText,
        error: errorData,
        requestData: formattedData,
        url: pdfServiceUrl
      });
      throw new Error(`Failed to generate PDF: ${errorData.detail || pdfResponse.statusText}`);
    }

    const pdfData = await pdfResponse.json();

    // Store job description and PDF URL in database
    const savedJobDescription = await prisma.jobDescription.create({
      data: {
        title: 'Generated Resume',
        description: jobDescription,
        requirements: [], 
        pdfUrl: pdfData.pdf_url,
        userId: session.user.id,
      },
    });

    return NextResponse.json({
      status: 'success',
      data: {
        pdf: {
          filename: formattedData.output_filename,
          url: pdfData.pdf_url
        },
        jobDescriptionId: savedJobDescription.id
      }
    });
  } catch (error: unknown) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to generate PDF',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 