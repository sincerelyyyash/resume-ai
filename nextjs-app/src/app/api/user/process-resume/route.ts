import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { extractTextFromFile, validateFile } from "@/lib/fileTextExtractor";
import { parseResumeText } from "@/lib/resumeParser";
import { apiSecurity } from "@/middleware/api-security";

// Configuration constants
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  let userId: string | undefined;

  try {
    // Apply security measures (includes rate limiting, CORS, etc.)
    const securityResponse = await apiSecurity(req);
    if (securityResponse) return securityResponse;

    // Authentication check
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({
        success: false,
        error: "Authentication required"
      }, { status: 401 });
    }

    userId = session.user.id || session.user.email;

    // Parse form data with error handling
    let formData: FormData;
    try {
      formData = await req.formData();
    } catch (formDataError) {
      console.error('Form data parsing error:', formDataError);
      return NextResponse.json({
        success: false,
        error: "Invalid form data"
      }, { status: 400 });
    }

    const file = formData.get("file") as File;
    const autoSave = formData.get("autoSave") === "true";

    // File validation
    if (!file) {
      return NextResponse.json({
        success: false,
        error: "No file provided"
      }, { status: 400 });
    }

    if (!(file instanceof File)) {
      return NextResponse.json({
        success: false,
        error: "Invalid file format"
      }, { status: 400 });
    }

    // Validate file properties
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return NextResponse.json({
        success: false,
        error: "Invalid file type. Only PDF and DOCX files are supported."
      }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({
        success: false,
        error: "File size exceeds 5MB limit"
      }, { status: 400 });
    }

    if (file.size === 0) {
      return NextResponse.json({
        success: false,
        error: "File is empty"
      }, { status: 400 });
    }

    // Additional validation using utility function
    try {
      validateFile(file);
    } catch (validationError) {
      return NextResponse.json({
        success: false,
        error: validationError instanceof Error ? validationError.message : "File validation failed"
      }, { status: 400 });
    }

    // Extract text from file
    let extractedText: string;
    try {
      extractedText = await extractTextFromFile(file);
      
      if (!extractedText || extractedText.trim().length === 0) {
        return NextResponse.json({
          success: false,
          error: "No text could be extracted from the file. Please ensure the file contains readable content."
        }, { status: 422 });
      }

      // Validate extracted text length
      if (extractedText.length < 50) {
        return NextResponse.json({
          success: false,
          error: "Insufficient content in the file. Please upload a complete resume."
        }, { status: 422 });
      }

    } catch (extractionError) {
      console.error(`Text extraction failed for user ${userId}:`, {
        error: extractionError instanceof Error ? extractionError.message : String(extractionError),
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        timestamp: new Date().toISOString()
      });

      return NextResponse.json({
        success: false,
        error: "Failed to extract text from the file. Please ensure the file is not corrupted."
      }, { status: 500 });
    }

    // Parse extracted text using AI
    let parsedData;
    try {
      parsedData = await parseResumeText(extractedText);
      
      // Validate parsed data structure
      if (!parsedData || typeof parsedData !== 'object') {
        throw new Error('Invalid parsed data structure');
      }

    } catch (parsingError) {
      console.error(`AI parsing failed for user ${userId}:`, {
        error: parsingError instanceof Error ? parsingError.message : String(parsingError),
        textLength: extractedText?.length || 0,
        fileName: file.name,
        timestamp: new Date().toISOString()
      });

      return NextResponse.json({
        success: false,
        error: "Failed to parse resume content. Please try again or contact support if the issue persists."
      }, { status: 500 });
    }

    // Log successful processing (production-level logging)
    const processingTime = Date.now() - startTime;
    console.log(`Resume processed successfully for user ${userId}:`, {
      fileName: file.name,
      fileSize: file.size,
      textLength: extractedText.length,
      processingTime: `${processingTime}ms`,
      dataExtracted: {
        hasPersonalInfo: !!parsedData.user && Object.keys(parsedData.user).length > 0,
        experienceCount: parsedData.experiences?.length || 0,
        educationCount: parsedData.education?.length || 0,
        skillsCount: parsedData.skills?.length || 0,
        projectsCount: parsedData.projects?.length || 0,
        certificationsCount: parsedData.certifications?.length || 0
      },
      timestamp: new Date().toISOString()
    });

    // Return successful response
    return NextResponse.json({
      success: true,
      message: "Resume processed successfully",
      data: parsedData,
      metadata: {
        filename: file.name,
        fileSize: file.size,
        textLength: extractedText.length,
        processingTime,
        autoSave
      }
    }, { status: 200 });

  } catch (error) {
    // Log unexpected errors with structured logging
    const processingTime = Date.now() - startTime;
    console.error(`Unexpected error processing resume for user ${userId || 'unknown'}:`, {
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
      error: "An unexpected error occurred while processing your resume. Please try again."
    }, { status: 500 });
  }
}

 