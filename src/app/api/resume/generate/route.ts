import { NextResponse } from 'next/server';
import { optimizeResume } from '@/lib/resumeOptimiser';
import { generateResumePDF } from '@/lib/utils/resumeGenerator';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { jobDescription, userData } = body;

    if (!jobDescription || !userData) {
      return NextResponse.json(
        { error: "Job description and user data are required" },
        { status: 400 }
      );
    }

    // Ensure userData is a string if it's an object
    const userDataString = typeof userData === 'string' 
      ? userData 
      : JSON.stringify(userData);

    const result = await optimizeResume(jobDescription, userDataString);

    if (!result || !result.optimized_resume) {
      return NextResponse.json(
        { error: "Failed to optimize resume" },
        { status: 500 }
      );
    }

    // Generate PDF
    const { buffer, filename } = await generateResumePDF(result.optimized_resume);

    // Return both the optimization results and the PDF info
    return NextResponse.json({
      success: true,
      data: {
        parsed_jd: result.parsed_jd,
        analysis: result.analysis,
        optimized_resume: result.optimized_resume,
        pdf: {
          buffer: buffer.toString('base64'),
          filename: filename,
          url: `/pdfs/${filename}`
        }
      }
    });

  } catch (error) {
    console.error("Error in resume optimization route:", error);
    return NextResponse.json(
      { error: "Failed to process resume optimization" },
      { status: 500 }
    );
  }
} 