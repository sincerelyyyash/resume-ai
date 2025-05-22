import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions';
import { prisma } from '@/lib/prisma';
import { optimizeResume } from '@/lib/resumeOptimiser';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { jobDescription, userData } = await req.json();

    // First optimize the resume using LLM
    const optimizedData = await optimizeResume(jobDescription, JSON.stringify(userData));

    // Format the data for the PDF service using the optimized data
    const formattedData = {
      full_name: optimizedData.optimized_resume.full_name || userData.name || '',
      phone_number: optimizedData.optimized_resume.phone_number || userData.phone || null,
      email: optimizedData.optimized_resume.email || userData.email || '',
      linkedin_url: optimizedData.optimized_resume.linkedin_url || userData.linkedin || '',
      github_url: optimizedData.optimized_resume.github_url || userData.github || '',
      education_entries: optimizedData.optimized_resume.education_entries.map((edu: { institution: string; location: string; degree: string; date_range: string }) => ({
        institution: edu.institution || '',
        location: edu.location || '',
        degree: edu.degree || '',
        date_range: edu.date_range || ''
      })),
      experience_entries: optimizedData.optimized_resume.experience_entries.map((exp: { title: string; organization: string; location: string; dates: string; responsibilities: string[] }) => ({
        title: exp.title || '',
        organization: exp.organization || '',
        location: exp.location || '',
        dates: exp.dates || '',
        responsibilities: exp.responsibilities || []
      })),
      project_entries: optimizedData.optimized_resume.project_entries.map((proj: { name: string; technologies: string; date_range: string; details: string[] }) => ({
        name: proj.name || '',
        technologies: proj.technologies || '',
        date_range: proj.date_range || undefined,
        details: proj.details || []
      })),
      languages: optimizedData.optimized_resume.languages || [],
      frameworks: optimizedData.optimized_resume.frameworks || [],
      developer_tools: optimizedData.optimized_resume.developer_tools || [],
      libraries: optimizedData.optimized_resume.libraries || [],
      output_filename: `${(optimizedData.optimized_resume.full_name || userData.name || 'resume').toLowerCase().replace(/\s+/g, '-')}-resume.pdf`
    };

    // Validate required fields
    if (!formattedData.full_name || !formattedData.email) {
      console.error('Missing required fields:', {
        full_name: formattedData.full_name,
        email: formattedData.email,
        original_data: userData,
        optimized_data: optimizedData
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
        jobDescriptionId: savedJobDescription.id,
        analysis: optimizedData.analysis
      }
    });
    } catch (error: unknown) {
      console.error('Error generating PDF:', error);
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Failed to generate PDF' },
      { status: 500 }
    );
  }
} 