import { NextResponse } from 'next/server';
import { generateResumePDF } from '@/lib/utils/resumeGenerator';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Generate PDF
    const pdfBuffer = await generateResumePDF(data);

    // Return PDF as response
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="resume.pdf"'
      }
    });
  } catch (error: any) {
    console.error('Error generating resume:', error);
    
    // Check if it's a LaTeX installation error
    if (error.message.includes('LaTeX is not installed')) {
      return NextResponse.json(
        { 
          error: 'LaTeX is not installed',
          message: error.message,
          type: 'LATEX_MISSING'
        },
        { status: 400 }
      );
    }

    // Check if it's a LaTeX compilation error
    if (error.message.includes('Failed to compile LaTeX document')) {
      return NextResponse.json(
        { 
          error: 'LaTeX compilation failed',
          message: error.message,
          type: 'LATEX_COMPILATION_ERROR'
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        error: 'Failed to generate resume',
        message: error.message
      },
      { status: 500 }
    );
  }
} 