import { NextResponse } from 'next/server';
import { optimizeAndGenerateResume } from '@/lib/utils/resumeGenerator';
import { optimizeResume } from '@/lib/resumeOptimiser';

export async function POST(request: Request) {
  try {
    const { jobDescription, userData } = await request.json();
    
    // Parse the user data
    const parsedUserData = JSON.parse(userData);
    
    // Extract personal information that doesn't need optimization
    const personalInfo = {
      name: parsedUserData.name,
      email: parsedUserData.email,
      phone: parsedUserData.phone,
      linkedin: parsedUserData.linkedin,
      github: parsedUserData.github,
      website: parsedUserData.website || undefined
    };
    
    // Only send the content sections to be optimized by the LLM
    const contentForOptimization = {
      education: parsedUserData.education || [],
      experience: parsedUserData.experience || [],
      projects: parsedUserData.projects || [],
      skills: parsedUserData.skills || {}
    };
    
    // Get optimized content from LLM
    const optimizedResult = await optimizeResume(jobDescription, JSON.stringify(contentForOptimization));
    
    // Extract the optimized sections
    const optimizedContent = {
      summary: optimizedResult.optimized_resume.summary,
      education: optimizedResult.optimized_resume.education,
      experience: optimizedResult.optimized_resume.experience,
      projects: optimizedResult.optimized_resume.projects,
      skills: optimizedResult.optimized_resume.skills
    };
    
    // Generate the PDF with optimized content + personal info
    const pdfBuffer = await optimizeAndGenerateResume(optimizedContent, personalInfo);
    
    // Return the PDF and optimization analysis
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="optimized-resume.pdf"',
        'X-Optimization-Results': JSON.stringify({
          ats_score: optimizedResult.analysis.ats_score,
          matched_keywords: optimizedResult.analysis.matched_keywords,
          missing_keywords: optimizedResult.analysis.missing_keywords,
          recommendations: optimizedResult.analysis.recommendations
        })
      }
    });
  } catch (error: any) {
    console.error('Error in resume optimization route:', error);
    return NextResponse.json(
      { 
        error: 'Failed to optimize resume',
        message: error.message
      },
      { status: 500 }
    );
  }
} 